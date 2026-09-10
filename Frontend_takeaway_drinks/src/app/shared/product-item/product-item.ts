import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UpperCasepipe } from '../pipes/UpperCasePipe.pipe';
import { CurrencyPipe } from '../pipes/CurrencyPipe.pipe';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    UpperCasepipe,
    CurrencyPipe
  ],
  templateUrl: './product-item.html',
  styleUrl: './product-item.css'
})
export class ProductItemComponent {
  @Input() products: any[] = [];
  searchText = '';

  get filteredProducts(): any[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.products;
    }
    return this.products.filter(product =>
      product.name?.toLowerCase().includes(keyword)
    );
  }
}