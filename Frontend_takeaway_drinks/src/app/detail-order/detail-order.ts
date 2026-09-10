import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { SpinnerService } from '../../services/spinner.service';
import { Order } from '../shared/types/order';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-order.html',
  styleUrl: './detail-order.css'
})
export class DetailOrder implements OnInit {
  order = signal<Order | null>(null);
  orderId: number | null = null;
  errorMessage = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.orderId = id;
    this.loadOrder(id);
  }

  // Lấy chi tiết đơn hàng từ API
  loadOrder(id: number) {
    this.spinnerService.showSpinner();
    this.errorMessage.set('');

    this.orderService.getOrder(id).subscribe({
      next: response => {
        const data = response?.data;

        if (!data) {
          this.order.set(null);
          this.errorMessage.set('Không tìm thấy đơn hàng.');
          this.spinnerService.hideSpinner();
          return;
        }

        this.order.set({
          id: Number(data.id),
          order_code: data.order_code,
          status: data.status,
          total_amount: Number(data.total_amount),
          created_at: data.created_at,
          items: (data.items ?? []).map((item: any) => ({
            product: {
              id: item.product_id !== null ? Number(item.product_id) : 0,
              name: item.product_name,
              price: Number(item.price),
              image: item.img,
              category: item.category ?? ''
            },
            quantity: Number(item.quantity)
          }))
        });

        this.spinnerService.hideSpinner();
      },
      error: error => {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        this.order.set(null);
        this.errorMessage.set(
          error?.error?.message || 'Không thể tải thông tin đơn hàng.'
        );
        this.spinnerService.hideSpinner();
      }
    });
  }

  get totalItems() {
    return this.order()?.items.reduce(
      (total, item) => total + item.quantity,
      0
    ) ?? 0;
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

  canPrepare() {
    return this.order()?.status === 'pending';
  }

  canComplete() {
    return this.order()?.status === 'preparing';
  }

  canCancel() {
    return this.order()?.status === 'pending' ||
      this.order()?.status === 'preparing';
  }

  // Cập nhật trạng thái đơn hàng
  updateStatus(status: Order['status']) {
    const currentOrder = this.order();

    if (!currentOrder) return;

    if (status === 'preparing' && !this.canPrepare()) return;
    if (status === 'completed' && !this.canComplete()) return;
    if (status === 'cancelled' && !this.canCancel()) return;

    this.spinnerService.showSpinner();
    this.errorMessage.set('');

    this.orderService.updateOrderStatus(
      currentOrder.id,
      status
    ).subscribe({
      next: response => {
        const updatedStatus = response?.data?.status;

        this.order.set({
          ...currentOrder,
          status: updatedStatus ?? status
        });

        this.spinnerService.hideSpinner();
      },
      error: error => {
        console.error('Lỗi cập nhật trạng thái:', error);
        this.errorMessage.set(
          error?.error?.message ||
          'Không thể cập nhật trạng thái đơn hàng.'
        );
        this.spinnerService.hideSpinner();
      }
    });
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price);
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

  goBack() {
    this.router.navigate(['/orders']);
  }
}