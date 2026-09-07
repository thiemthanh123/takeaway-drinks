import { Component } from '@angular/core';
import { ProductItems } from '../shared/types/productitem';
import { ProductItemComponent } from '../shared/product-item/product-item';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [ProductItemComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  products: ProductItems[] = [];
  drinkProducts: ProductItems[] = [];
  foodProducts: ProductItems[] = [];
  loading = true;
  selectedCategory: string | null = null;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {

    this.productService.getProducts().subscribe(
      (data) => {
        const listProduct = data.data;

        this.products = listProduct.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          image: item.img,
          category: item.category
        }));

        this.drinkProducts = this.products.filter((product: any) =>
          product.category === 'drink'
        );

        this.foodProducts = this.products.filter((product: any) =>
          product.category === 'food'
        );

        this.loading = false;
      },
      error => {
        console.error('Get products error:', error);
        this.loading = false;
      }
    );

  }

  selectCategory(category: string): void {
    if (this.selectedCategory === category) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
  }

  ngOnDestroy(): void {
  }

  handleDelete(id: number): void {
    this.productService.deleteProduct(id).subscribe((data: any) => {
      if (data.status == "200") {
        this.drinkProducts = this.drinkProducts.filter(product => product.id !== id);
        this.foodProducts = this.foodProducts.filter(product => product.id !== id);
      }
    });
  }
}
