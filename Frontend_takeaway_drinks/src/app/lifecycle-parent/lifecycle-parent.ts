import {
  Component,
  OnInit
} from '@angular/core';

import { LifecycleChild } from '../lifecycle-child/lifecycle-child';

@Component({
  selector: 'app-lifecycle-parent',
  standalone: true,
  imports: [LifecycleChild],
  templateUrl: './lifecycle-parent.html',
  styleUrl: './lifecycle-parent.css'
})
export class LifecycleParent implements OnInit {

  productName: string = 'Coca Cola';

  showChild: boolean = true;

  constructor() {
    console.log('🟢 PARENT constructor');
  }

  ngOnInit(): void {
    console.log('🔵 PARENT ngOnInit');
  }

  changeProduct(): void {

    this.productName = 'Pepsi ' + Date.now();

    console.log(
      'Parent changed product:',
      this.productName
    );
  }

  toggleChild(): void {

    this.showChild = !this.showChild;

  }
}