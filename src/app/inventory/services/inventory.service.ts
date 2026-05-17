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

  private buildApiUrl(path: string): string {
    const base = (environment.BaseUrl || '').trim();
    return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

  // ===< get products >===
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.buildApiUrl('products'));
  }

  // ===< add product >===
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.buildApiUrl('products'), product);
  }

  // ===< get product by id >===
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.buildApiUrl(`products/${id}`));
  }

  // ===< delete product >===
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(this.buildApiUrl(`products/${id}`));
  }

  // ===< update product >===
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(this.buildApiUrl(`products/${id}`), product);
  }
}
