import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Product } from '../model/inventory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.BaseUrl}/products`);
  }
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.BaseUrl}/products/${id}`);
  }
}
