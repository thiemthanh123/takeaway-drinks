import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  // Lấy danh sách đơn hàng
  getOrders(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Lấy chi tiết đơn hàng
  getOrder(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Tạo đơn hàng
  createOrder(order: any): Observable<any> {
    return this.http.post<any>(
      this.apiUrl,
      order
    );
  }

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/${id}/status`,
      { status }
    );
  }
}