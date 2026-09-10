import { Component, OnInit, signal } from '@angular/core';
import { ProductItems } from '../shared/types/productitem';
import { ProductItemComponent } from '../shared/product-item/product-item';
import { ProductService } from '../../services/product.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  imports: [ProductItemComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html'
})
export class Home implements OnInit {
  products = signal<ProductItems[]>([]);
  drinkProducts = signal<ProductItems[]>([]);
  foodProducts = signal<ProductItems[]>([]);
  selectedCategory = signal<string | null>(null);

  constructor(
    private productService: ProductService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Lấy danh sách sản phẩm
  loadProducts(): void {
    this.spinnerService.showSpinner();

    this.productService.getProducts().subscribe({
      next: data => {
        const listProduct = data?.data ?? [];

        const products = listProduct.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.img,
          category: item.category
        }));

        this.products.set(products);

        this.drinkProducts.set(
          products.filter((product: ProductItems) =>
            product.category === 'drink'
          )
        );

        this.foodProducts.set(
          products.filter((product: ProductItems) =>
            product.category === 'food'
          )
        );

        this.spinnerService.hideSpinner();
      },
      error: error => {
        console.error('Get products error:', error);
        this.products.set([]);
        this.drinkProducts.set([]);
        this.foodProducts.set([]);
        this.spinnerService.hideSpinner();
      }
    });
  }

  selectCategory(category: string): void {
    if (category === 'all') {
      this.selectedCategory.set(null);
      return;
    }
    this.selectedCategory.set(category);
  }

  handleDelete(id: number): void {
    this.spinnerService.showSpinner();

    this.productService.deleteProduct(id).subscribe({
      next: data => {
        if (data.status == 200) {
          this.products.update(products =>
            products.filter(product => product.id !== id)
          );

          this.drinkProducts.update(products =>
            products.filter(product => product.id !== id)
          );

          this.foodProducts.update(products =>
            products.filter(product => product.id !== id)
          );
        }

        this.spinnerService.hideSpinner();
      },
      error: error => {
        console.error('Delete product error:', error);
        this.spinnerService.hideSpinner();
      }
    });
  }

  scrollToMenu(): void {
    document.getElementById('menu')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}