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
  // Chuyển đến trang Home
  goHome(): void {
    this.router.navigate(['/home']);
  }
  // Cuộn đến phần giới thiệu
  scrollToStory(): void {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
  }
}