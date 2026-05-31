import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { Product } from '../../inventory/model/inventory';
import { InventoryService } from '../../inventory/services/inventory.service';

interface CategoryStockData {
  name: string;
  stock: number;
}

interface CategoryValueData {
  name: string;
  value: number;
}

interface DailyMetric {
  date: string;
  stock: number;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, HighchartsChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  readonly lowStockThreshold = 30;

  isLoading = true;
  errorMessage = '';

  products: Product[] = [];
  topStockProducts: Product[] = [];
  lowStockProducts: Product[] = [];

  productCount = 0;
  totalQuantityInHand = 0;
  categoryCount = 0;
  totalInventoryValue = 0;
  discountedInventoryValue = 0;
  discountImpact = 0;
  averageRating = 0;
  latestUpdate = '';

  stockByCategoryChart: Highcharts.Options = {};
  valueByCategoryChart: Highcharts.Options = {};
  valueTrendChart: Highcharts.Options = {};
  ratingDistributionChart: Highcharts.Options = {};

  constructor() {
    this.setEmptyCharts();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products || [];
        this.buildDashboardState(this.products);
        this.isLoading = false;
      },
      error: (error: unknown) => {
        console.error('Dashboard load error', error);
        this.products = [];
        this.buildDashboardState([]);
        this.errorMessage =
          'Unable to load dashboard data. Please check your API and try again.';
        this.isLoading = false;
      },
    });
  }

  getInventoryValue(product: Product): number {
    return this.getEffectivePrice(product) * this.toNumber(product.stock);
  }

  isCriticalStock(stock: number): boolean {
    return stock < 15;
  }

  private buildDashboardState(products: Product[]): void {
    this.productCount = products.length;
    this.totalQuantityInHand = products.reduce(
      (sum: number, product: Product) => sum + this.toNumber(product.stock),
      0,
    );

    this.totalInventoryValue = products.reduce(
      (sum: number, product: Product) =>
        sum + this.toNumber(product.price) * this.toNumber(product.stock),
      0,
    );

    this.discountedInventoryValue = products.reduce(
      (sum: number, product: Product) => sum + this.getInventoryValue(product),
      0,
    );

    this.discountImpact = Math.max(
      this.totalInventoryValue - this.discountedInventoryValue,
      0,
    );

    this.averageRating =
      this.productCount > 0
        ? products.reduce(
            (sum: number, product: Product) => sum + this.toNumber(product.rating),
            0,
          ) / this.productCount
        : 0;

    const categorySet = new Set<string>(
      products
        .map((product: Product) => (product.category || '').trim())
        .filter((category: string) => Boolean(category)),
    );
    this.categoryCount = categorySet.size;
    this.latestUpdate = this.getLatestUpdate(products);

    this.topStockProducts = [...products]
      .sort((a: Product, b: Product) => this.toNumber(b.stock) - this.toNumber(a.stock))
      .slice(0, 5);

    this.lowStockProducts = [...products]
      .filter((product: Product) => this.toNumber(product.stock) < this.lowStockThreshold)
      .sort((a: Product, b: Product) => this.toNumber(a.stock) - this.toNumber(b.stock))
      .slice(0, 5);

    this.buildCharts(products);
  }

  private buildCharts(products: Product[]): void {
    const stockByCategory = this.getStockByCategory(products);
    const valueByCategory = this.getValueByCategory(products);
    const metricsByDate = this.getMetricsByDate(products);
    const ratings = this.getRatingDistribution(products);

    this.stockByCategoryChart = this.createStockByCategoryChart(stockByCategory);
    this.valueByCategoryChart = this.createValueByCategoryChart(valueByCategory);
    this.valueTrendChart = this.createValueTrendChart(metricsByDate);
    this.ratingDistributionChart = this.createRatingDistributionChart(ratings);
  }

  private setEmptyCharts(): void {
    this.stockByCategoryChart = this.createStockByCategoryChart([]);
    this.valueByCategoryChart = this.createValueByCategoryChart([]);
    this.valueTrendChart = this.createValueTrendChart([]);
    this.ratingDistributionChart = this.createRatingDistributionChart([]);
  }

  private getStockByCategory(products: Product[]): CategoryStockData[] {
    const categoryMap = new Map<string, number>();

    for (const product of products) {
      const category = product.category?.trim() || 'Uncategorized';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + this.toNumber(product.stock));
    }

    return Array.from(categoryMap.entries())
      .map(([name, stock]: [string, number]) => ({ name, stock }))
      .sort((a: CategoryStockData, b: CategoryStockData) => b.stock - a.stock);
  }

  private getValueByCategory(products: Product[]): CategoryValueData[] {
    const categoryMap = new Map<string, number>();

    for (const product of products) {
      const category = product.category?.trim() || 'Uncategorized';
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + this.getInventoryValue(product));
    }

    return Array.from(categoryMap.entries())
      .map(([name, value]: [string, number]) => ({ name, value }))
      .sort((a: CategoryValueData, b: CategoryValueData) => b.value - a.value);
  }

  private getMetricsByDate(products: Product[]): DailyMetric[] {
    const dateMap = new Map<string, DailyMetric>();

    for (const product of products) {
      const date = product.lastUpdated || 'Unknown';
      const existing = dateMap.get(date) || { date, stock: 0, value: 0 };
      existing.stock += this.toNumber(product.stock);
      existing.value += this.getInventoryValue(product);
      dateMap.set(date, existing);
    }

    return Array.from(dateMap.values()).sort(
      (a: DailyMetric, b: DailyMetric) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }

  private getRatingDistribution(products: Product[]): number[] {
    const distribution = [0, 0, 0, 0, 0];

    for (const product of products) {
      const normalizedRating = Math.min(
        Math.max(Math.round(this.toNumber(product.rating)), 1),
        5,
      );
      distribution[normalizedRating - 1] += 1;
    }

    return distribution;
  }

  private createStockByCategoryChart(
    data: CategoryStockData[],
  ): Highcharts.Options {
    const pieSeries: Highcharts.SeriesPieOptions = {
      type: 'pie',
      name: 'Units',
      data: data.map((item: CategoryStockData) => ({
        name: item.name,
        y: item.stock,
      })),
      innerSize: '60%',
    };

    return {
      chart: { type: 'pie', height: 320, backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.y}</b> units ({point.percentage:.1f}%)',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format: '{point.name}',
          },
        },
      },
      series: [pieSeries],
      colors: ['#0ea5e9', '#14b8a6', '#f59e0b', '#f97316', '#6366f1'],
    };
  }

  private createValueByCategoryChart(
    data: CategoryValueData[],
  ): Highcharts.Options {
    const series: Highcharts.SeriesColumnOptions = {
      type: 'column',
      name: 'Inventory Value',
      data: data.map((item: CategoryValueData) => Number(item.value.toFixed(2))),
      colorByPoint: true,
    };

    return {
      chart: { type: 'column', height: 320, backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories: data.map((item: CategoryValueData) => item.name),
        crosshair: true,
      },
      yAxis: {
        title: { text: 'Value (EGP)' },
      },
      legend: { enabled: false },
      tooltip: {
        pointFormat: '<b>EGP {point.y:,.0f}</b>',
      },
      series: [series],
      colors: ['#06b6d4', '#10b981', '#f59e0b', '#f97316', '#8b5cf6'],
    };
  }

  private createValueTrendChart(data: DailyMetric[]): Highcharts.Options {
    const categories = data.map((item: DailyMetric) => item.date);

    const stockSeries: Highcharts.SeriesLineOptions = {
      type: 'line',
      name: 'Stock Units',
      data: data.map((item: DailyMetric) => item.stock),
      yAxis: 0,
      color: '#0ea5e9',
      marker: { enabled: true, radius: 3 },
    };

    const valueSeries: Highcharts.SeriesLineOptions = {
      type: 'line',
      name: 'Inventory Value',
      data: data.map((item: DailyMetric) => Number(item.value.toFixed(2))),
      yAxis: 1,
      color: '#f97316',
      marker: { enabled: true, radius: 3 },
    };

    return {
      chart: { type: 'line', height: 320, backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: { categories },
      yAxis: [
        {
          title: { text: 'Units' },
          labels: {
            format: '{value}',
          },
        },
        {
          title: { text: 'Value (EGP)' },
          labels: {
            format: 'EGP {value}',
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      series: [stockSeries, valueSeries],
    };
  }

  private createRatingDistributionChart(data: number[]): Highcharts.Options {
    const categories = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];

    const series: Highcharts.SeriesColumnOptions = {
      type: 'column',
      name: 'Products',
      data,
      color: '#0f766e',
      borderRadius: 6,
    };

    return {
      chart: { type: 'column', height: 320, backgroundColor: 'transparent' },
      title: { text: '' },
      credits: { enabled: false },
      xAxis: {
        categories,
      },
      yAxis: {
        title: { text: 'Product Count' },
        allowDecimals: false,
      },
      legend: { enabled: false },
      tooltip: {
        pointFormat: '<b>{point.y}</b> products',
      },
      series: [series],
    };
  }

  private getLatestUpdate(products: Product[]): string {
    const availableDates = products
      .map((product: Product) => product.lastUpdated)
      .filter((date: string) => Boolean(date));

    if (!availableDates.length) {
      return 'N/A';
    }

    const latestTime = Math.max(
      ...availableDates.map((date: string) => new Date(date).getTime()),
    );

    if (Number.isNaN(latestTime)) {
      return 'N/A';
    }

    return new Date(latestTime).toISOString();
  }

  private getEffectivePrice(product: Product): number {
    const price = this.toNumber(product.price);
    const discountedPrice = this.toNumber(product.priceAfterDiscount);
    return discountedPrice > 0 ? discountedPrice : price;
  }

  private toNumber(value: number | undefined): number {
    return Number(value || 0);
  }
}
