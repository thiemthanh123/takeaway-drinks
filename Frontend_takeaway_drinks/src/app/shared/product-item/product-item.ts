import { CurrencyPipe } from '../pipes/CurrencyPipe.pipe';
import { Component, Input, Output, EventEmitter, OnDestroy, SimpleChanges } from '@angular/core';
import { UpperCasepipe } from '../pipes/UpperCasePipe.pipe';
import { RouterLink } from '@angular/router';
import { ProductItems } from '../types/productitem';

@Component({
  imports: [CurrencyPipe, UpperCasepipe, RouterLink],
  selector: 'app-product-item',
  styleUrl: './product-item.css',
  templateUrl: './product-item.html',
})
export class ProductItemComponent implements OnDestroy {
  @Input() products: ProductItems[] = [];
  @Input() isVisible: boolean = true;
  @Output() dataEvent = new EventEmitter<number>();

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }
  
  ngOnDestroy(): void {
  }

  handleDeleteProduct(id: number): void {
    this.dataEvent.emit(id);
  }

  get totalPrice(): number {
    return this.products.reduce((total, product) => total + product.price, 0);
  }
}
