import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
  product = signal<any | null>(null);
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadProduct(id);
  }

  // Lấy thông tin sản phẩm
  loadProduct(id: number): void {
    this.spinnerService.showSpinner();
    this.productService.getProduct(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.product.set(response.data);
          } else {
            this.product.set(null);
            this.router.navigate(['/home']);
          }
          this.spinnerService.hideSpinner();
        },
        error: (error) => {
          console.error('GET PRODUCT ERROR:', error);
          this.product.set(null);
          this.spinnerService.hideSpinner();
          this.router.navigate(['/home']);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  changeProduct(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    this.router.navigate(['/edit', product.id]);
  }

  // Xóa sản phẩm
  deleteProduct(): void {
    const product = this.product();
    if (!product) {
      return;
    }
    const confirmed = confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}" không?`
    );
    if (!confirmed) {
      return;
    }
    this.spinnerService.showSpinner();
    this.productService.deleteProduct(product.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            alert('Xóa sản phẩm thành công!');
            this.spinnerService.hideSpinner();
            this.router.navigate(['/home']);
          } else {
            this.spinnerService.hideSpinner();
            alert('Xóa sản phẩm thất bại!');
          }
        },
        error: (error) => {
          console.error('DELETE PRODUCT ERROR:', error);
          this.spinnerService.hideSpinner();
          alert('Xóa sản phẩm thất bại!');
        }
      });
  }
}