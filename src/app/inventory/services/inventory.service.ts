import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Product } from '../model/inventory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  // ===< inject the http client >===
  http = inject(HttpClient);

  // ===< get products >===
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.BaseUrl}/products`);
  }

  // ===< add product >===
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.BaseUrl}/products`, product);
  }

  // ===< get product by id >===
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.BaseUrl}/products/${id}`);
  }

  // ===< delete product >===
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.BaseUrl}/products/${id}`);
  }

  // ===< update product >===
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${environment.BaseUrl}/products/${id}`, product);
  }
}
