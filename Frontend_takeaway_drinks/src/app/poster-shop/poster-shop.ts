import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poster-shop',
  standalone: true,
  templateUrl: './poster-shop.html',
  styleUrl: './poster-shop.css'
})
export class PosterShopComponent {

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/']);
  }
}