import { Component, input, OnInit } from '@angular/core';
import { Product } from '../../../inventory/model/inventory';
import { GalleriaModule } from 'primeng/galleria';
@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss'],
  standalone: true,
  imports: [GalleriaModule],
})
export class ProductImagesComponent implements OnInit {
  config = input<Product>();
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  ngOnInit() {}
}
