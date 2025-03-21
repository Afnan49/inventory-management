import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StockFilterValue = 'all' | 'low' | 'in';

export interface StockFilter {
  value: StockFilterValue;
  label: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<StockFilterValue>();

  filterOptions: StockFilter[] = [
    { value: 'all', label: 'All Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'in', label: 'In Stock' },
  ];

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as StockFilterValue;
    this.filterChange.emit(value);
  }
}
