import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-detail',
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class Detail implements OnInit {

  loading = true;
  product: any = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

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
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  changeProduct(): void {
    if (!this.product) {
      return;
    }

    this.router.navigate([
      '/change',
      this.product.id
    ]);
  }
}