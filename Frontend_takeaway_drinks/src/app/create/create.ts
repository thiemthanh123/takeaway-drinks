import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-create',
  styleUrl: './create.css',
  templateUrl: './create.html',
})
export class Create {
  imageFile: File | null = null;
  imagePreview: string | null = null;
  product = new FormGroup({
    name: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required)
  })


  get name() {
    return this.product.get('name');
  }

  get price() {
    return this.product.get('price');
  }

  constructor(private productService: ProductService, private router: Router) {

  }

  onImageSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  this.imageFile = file;

  // Tạo URL tạm thời để preview ngay
  this.imagePreview = URL.createObjectURL(file);

}

  back(): void {
    this.router.navigate(['/']);
  }

  handleAdd(): void {

    if (this.product.invalid) {
      this.product.markAllAsTouched();
      return;
    }

    if (!this.imageFile) {
      alert('Vui lòng chọn ảnh sản phẩm');
      return;
    }

    const formData = new FormData();

    formData.append(
      'name',
      String(this.product.get('name')?.value ?? '')
    );

    formData.append(
      'price',
      String(this.product.get('price')?.value ?? '')
    );

    formData.append(
      'image',
      this.imageFile
    );

    this.productService.createProduct(formData)
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          console.error(
            'CREATE PRODUCT ERROR:',
            error
          );
        }
      });
  }
}
