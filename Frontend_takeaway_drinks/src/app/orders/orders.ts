import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { SpinnerService } from '../../services/spinner.service';
import { Order } from '../shared/types/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders = signal<Order[]>([]);
  searchText = '';
  selectedStatus: 'all' | Order['status'] = 'all';

  constructor(
    private orderService: OrderService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  // Lấy danh sách đơn hàng
  loadOrders() {
    this.spinnerService.showSpinner();
    this.orderService.getOrders().subscribe({
      next: response => {
        this.orders.set(response?.data ?? []);
        this.spinnerService.hideSpinner();
      },
      error: error => {
        this.orders.set([]);
        this.spinnerService.hideSpinner();
      }
    });
  }

  get filteredOrders(): Order[] {
    const orders = this.orders();
    const keyword = this.searchText.trim().toLowerCase();
    return orders.filter(order => {
      const matchSearch = !keyword || order.order_code.toLowerCase().includes(keyword);
      const matchStatus = this.selectedStatus === 'all' || order.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  get totalOrders() {
    return this.orders().length;
  }

  get pendingOrders() {
    return this.orders().filter(order => order.status === 'pending').length;
  }

  get preparingOrders() {
    return this.orders().filter(order => order.status === 'preparing').length;
  }

  get completedOrders() {
    return this.orders().filter(order => order.status === 'completed').length;
  }

  get cancelledOrders() {
    return this.orders().filter(order => order.status === 'cancelled').length;
  }

  getStatusLabel(status: Order['status']) {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'preparing': return 'Đang chuẩn bị';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  getStatusClass(status: Order['status']) {
    return `status-${status}`;
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(Number(price));
  }

  formatDate(date: string) {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  createOrder() {
    this.router.navigate(['/orders/create']);
  }

  viewOrder(order: Order) {
    this.router.navigate(['/orders/detail', order.id]);
  }
}