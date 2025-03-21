import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderTitleComponent } from '../../../shared/components/header-title/header-title.component';
import { ProductImagesComponent } from '../../../shared/components/product-images/product-images.component';
import { RatingComponent } from '../../../shared/components/rating/rating.component';
import { NumberInputComponent } from '../../../shared/components/number-input/number-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FeaturesComponent } from '../../../shared/components/features/features.component';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../model/inventory';
import { CurrencyPipe } from '@angular/common';
import { DETAILS_BUTTON } from '../../constants/inventory.constants';
import { DetailsButtonEnum } from '../../enum/action.enums';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    ProductImagesComponent,
    RatingComponent,
    NumberInputComponent,
    ButtonComponent,
    FeaturesComponent,
    CurrencyPipe,
  ],
})
export class InventoryDetailsComponent implements OnInit {
  // ===< properties >===
  activatedRoute = inject(ActivatedRoute);
  productId = signal<string>('');
  inventoryService = inject(InventoryService);
  product = signal<Product>({} as Product);
  detailsButton = DETAILS_BUTTON;

  constructor() {}

  // ===< on init >===
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
    console.log(this.productId());
    this.getProductById(this.productId());
  }
  // ===< get product by id >===
  getProductById(id: string) {
    this.inventoryService.getProductById(id).subscribe((res: Product) => {
      this.product.set(res);
    });
  }
  // ===< on button click >===
  onButtonClick(optionsButtonId: any) {
    const menuActions: any = {
      [DetailsButtonEnum.ADD]: () => {
        console.log('Add logic here');
      },
      [DetailsButtonEnum.WISHLIST]: () => {
        console.log('Wishlist logic here');
      },
    };
    Object.keys(menuActions).forEach((key) => {
      if (key === optionsButtonId) {
        return menuActions[key]();
      }
    });
  }
}
