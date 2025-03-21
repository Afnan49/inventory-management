import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../model/inventory';
import { ProductImagesComponent } from '../../../shared/components/product-images/product-images.component';
import { CurrencyPipe } from '@angular/common';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss'],
  standalone: true,
  imports: [
    ProductImagesComponent,
    CurrencyPipe,
    RatingComponent,
    NumberInputComponent,
  ],
})
export class InventoryDetailsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  productId = signal<string>('');
  inventoryService = inject(InventoryService);
  product = signal<Product>({} as Product);

  constructor() {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
    console.log(this.productId());
    this.getProductById(this.productId());
  }
  getProductById(id: string) {
    this.inventoryService.getProductById(id).subscribe((res: Product) => {
      this.product.set(res);
    });
  }
}
