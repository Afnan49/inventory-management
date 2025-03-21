import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { InventoryListComponent } from './inventory-list.component';
import { InventoryService } from '../../services/inventory.service';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Product } from '../../model/inventory';
import { of } from 'rxjs';

describe('InventoryListComponent', () => {
  let component: InventoryListComponent;
  let fixture: ComponentFixture<InventoryListComponent>;
  let inventoryService: jasmine.SpyObj<InventoryService>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
      stock: 25,
      category: 'Category 1',
      lastUpdated: new Date().toISOString(),
      rating: 4.5,
      reviews: 100,
      thumbnail: 'thumbnail1.jpg',
      images: ['image1.jpg', 'image2.jpg'],
      features: ['feature1', 'feature2'],
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      price: 200,
      stock: 50,
      category: 'Category 2',
      lastUpdated: new Date().toISOString(),
      rating: 4.5,
      reviews: 100,
      thumbnail: 'thumbnail1.jpg',
      images: ['image1.jpg', 'image2.jpg'],
      features: ['feature1', 'feature2'],
    },
    {
      id: '3',
      name: 'Product 3',
      description: 'Description 3',
      price: 300,
      stock: 15,
      category: 'Category 3',
      lastUpdated: new Date().toISOString(),
      rating: 4.5,
      reviews: 100,
      thumbnail: 'thumbnail1.jpg',
      images: ['image1.jpg', 'image2.jpg'],
      features: ['feature1', 'feature2'],
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('InventoryService', ['getProducts']);
    spy.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        InventoryListComponent,
      ],
      providers: [{ provide: InventoryService, useValue: spy }, MessageService],
    }).compileComponents();

    inventoryService = TestBed.inject(
      InventoryService
    ) as jasmine.SpyObj<InventoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products with low stock (less than 30)', () => {
    component.allProducts = mockProducts;
    component.onFilter('low');

    expect(component.products()).toEqual([mockProducts[0], mockProducts[2]]);
    expect(component.products().length).toBe(2);
    component.products().forEach((product) => {
      expect(product.stock).toBeLessThan(30);
    });
  });

  it('should filter products with stock in (30 or more)', () => {
    component.allProducts = mockProducts;
    component.onFilter('in');
    expect(component.products()).toEqual([mockProducts[1]]);
    expect(component.products().length).toBe(1);
    component.products().forEach((product) => {
      expect(product.stock).toBeGreaterThanOrEqual(30);
    });
  });

  it('should show all products when filter is "all"', () => {
    component.allProducts = mockProducts;
    component.onFilter('all');

    expect(component.products()).toEqual(mockProducts);
    expect(component.products().length).toBe(mockProducts.length);
  });

  it('should initialize with all products on ngOnInit', () => {
    expect(inventoryService.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(mockProducts);
    expect(component.allProducts).toEqual(mockProducts);
  });

  it('should maintain filtered state after search operation', () => {
    component.allProducts = mockProducts;
    component.onFilter('low');
    component.onSearch('Product 1');

    expect(component.products().length).toBe(1);
    expect(component.products()[0].name).toBe('Product 1');
    expect(component.products()[0].stock).toBeLessThan(30);
  });
});
