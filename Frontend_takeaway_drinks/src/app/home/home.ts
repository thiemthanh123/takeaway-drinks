import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductItems } from '../shared/types/productitem';
import { ProductItemComponent } from '../shared/product-item/product-item';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [NgClass, ProductItemComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

  products: ProductItems[] = [
  ];

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(( data ) => {
      const listProduct = data.data;
      this.products = listProduct.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.img
      })
      );
    });
  }

  ngOnDestroy(): void {
  }

  handleDelete(id: number): void {
    this.productService.deleteProduct(id).subscribe(( data : any) => {
      if (data.status == "200") {
        this.products = this.products.filter(product => product.id !== id);
        window.location.reload();
      }
    })
  }
}
