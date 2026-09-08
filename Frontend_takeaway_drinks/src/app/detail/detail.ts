import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {
  loading = true;
  deleting = false;
  product: any = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/']);
      return;
    }
    this.productService.getProduct(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            this.product = response.data;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('GET PRODUCT ERROR:', error);
          this.router.navigate(['/']);
        }
      });
      console.log('Product ID:', this.product);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  changeProduct(): void {
    if (!this.product) {
      return;
    }
    this.router.navigate([
      '/edit',
      this.product.id
    ]);
  }

  deleteProduct(): void {
    if (!this.product || this.deleting) {
      return;
    }

    const confirmed = confirm(
      `Bạn có chắc muốn xóa sản phẩm "${this.product.name}" không?`
    );

    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.productService.deleteProduct(this.product.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 200) {
            alert('Xóa sản phẩm thành công!');
            this.router.navigate(['/']);
          } else {
            this.deleting = false;
            alert('Xóa sản phẩm thất bại!');
          }
        },
        error: (error) => {
          console.error('DELETE PRODUCT ERROR:', error);
          this.deleting = false;
          alert('Xóa sản phẩm thất bại!');
        }
      });
  }
}