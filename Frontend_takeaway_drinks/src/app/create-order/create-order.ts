import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { SpinnerService } from '../../services/spinner.service';
import { ProductItems } from '../shared/types/productitem';
import { OrderItems } from '../shared/types/orderitem';
import { CreateOrder } from '../shared/types/createorder';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-order.html',
  styleUrl: './create-order.css'
})
export class CreateOrderComponent implements OnInit {
  searchText = '';
  selectedCategory=signal<'drink'|'food'|null>(null);
  currentPage = 1;
  readonly itemsPerPage = 10;
  products = signal<ProductItems[]>([]);
  selectedItems = signal<OrderItems[]>([]);
  errorMessage = signal('');

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private spinnerService: SpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  // Lấy danh sách sản phẩm từ API
  loadProducts() {
    this.spinnerService.showSpinner();
    this.errorMessage.set('');
    this.productService.getProducts().subscribe({
      next: response => {
        const data = response?.data ?? [];
        this.products.set(data.map((product: any) => ({
          id: Number(product.id),
          name: product.name,
          price: Number(product.price),
          image: product.img,
          category: product.category
        })));
        this.spinnerService.hideSpinner();
      },
      error: error => {
        console.error('Lỗi lấy danh sách sản phẩm:', error);
        this.products.set([]);
        this.errorMessage.set('Không thể tải danh sách sản phẩm.');
        this.spinnerService.hideSpinner();
      }
    });
  }

  get filteredProducts(): ProductItems[] {
    const keyword = this.searchText.trim().toLowerCase();
    return this.products().filter(product => {
      const matchCategory = !this.selectedCategory() || product.category === this.selectedCategory();
      const matchSearch = !keyword || product.name.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    });
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.itemsPerPage));
  }

  get paginatedProducts(): ProductItems[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get pageNumbers() {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  // Chọn danh mục sản phẩm
  selectCategory(category: 'drink' | 'food') {
    this.selectedCategory.set(category);
    this.currentPage = 1;
    this.searchText = '';
  }

  searchProducts() {
    this.currentPage = 1;
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // Thêm sản phẩm vào đơn hàng
  addProduct(product: ProductItems) {
    const existingItem = this.selectedItems().find(
      item => item.product.id === product.id
    );
    if (existingItem) {
      this.selectedItems.update(items =>
        items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      return;
    }
    this.selectedItems.update(items => [
      ...items,
      {
        product: product,
        quantity: 1
      }
    ]);
  }

  increaseQuantity(item: OrderItems) {
    this.selectedItems.update(items =>
      items.map(selected =>
        selected.product.id === item.product.id
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      )
    );
  }

  decreaseQuantity(item: OrderItems) {
    if (item.quantity > 1) {
      this.selectedItems.update(items =>
        items.map(selected =>
          selected.product.id === item.product.id
            ? { ...selected, quantity: selected.quantity - 1 }
            : selected
        )
      );
      return;
    }
    this.removeItem(item);
  }

  removeItem(item: OrderItems) {
    this.selectedItems.update(items =>
      items.filter(
        selected => selected.product.id !== item.product.id
      )
    );
  }

  isSelected(product: ProductItems) {
    return this.selectedItems().some(
      item => item.product.id === product.id
    );
  }

  getProductQuantity(product: ProductItems) {
    const item = this.selectedItems().find(
      selected => selected.product.id === product.id
    );
    return item?.quantity ?? 0;
  }

  get totalItems() {
    return this.selectedItems().reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  get totalPrice() {
    return this.selectedItems().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('vi-VN').format(price);
  }

  // Gửi đơn hàng lên API
  createOrder() {
    if (this.selectedItems().length === 0) return;

    this.spinnerService.showSpinner();
    this.errorMessage.set('');

    const payload: CreateOrder = {
      items: this.selectedItems().map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(payload).subscribe({
      next: () => {
        this.spinnerService.hideSpinner();
        this.router.navigate(['/orders']);
      },
      error: error => {
        console.error('Lỗi tạo đơn hàng:', error);
        this.errorMessage.set(
          error?.error?.message || 'Không thể tạo đơn hàng.'
        );
        this.spinnerService.hideSpinner();
      }
    });
  }

  cancel() {
    this.router.navigate(['/orders']);
  }
}