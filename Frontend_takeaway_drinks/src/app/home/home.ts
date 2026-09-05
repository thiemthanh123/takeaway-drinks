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

  products: ProductItems[] = [
  ];
  loading = true;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    console.log('Home component initialized');
    this.productService.getProducts().subscribe((data) => {
      const listProduct = data.data;
      this.products = listProduct.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.img
      })
      );
      this.loading = false;
    },
      error => {
        console.error('Get products error:', error);
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
  }

  handleDelete(id: number): void {
    this.productService.deleteProduct(id).subscribe((data: any) => {
      if (data.status == "200") {
        this.products = this.products.filter(product => product.id !== id);
        window.location.reload();
      }
    })
  }
}
