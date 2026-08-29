import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // Lấy danh sách sản phẩm
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Lấy chi tiết sản phẩm
  getProduct(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // tạo mới sản phẩm
  createProduct(formData: FormData): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      formData
    );
  }

  // Cập nhật sản phẩm
  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      product
    );
  }

  // Xóa sản phẩm
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }
}