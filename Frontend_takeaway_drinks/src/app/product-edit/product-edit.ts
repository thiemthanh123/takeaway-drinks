import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css'
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  loading = false;
  saving = false;
  selectedFile: File | null = null;
  imagePreview = '';

  showImage = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(0)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = Number(id);
      this.getProduct();
    }
  }

  getProduct(): void {
    this.loading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (data: any) => {
        const product = data.data;
        this.productForm.patchValue({
          name: product.name,
          price: product.price
        });
        this.imagePreview = product.img || '';
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Không thể lấy thông tin sản phẩm:', error);
        this.loading = false;
        alert('Không thể tải thông tin sản phẩm!');
      }
    });
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh!');
    this.selectedFile = null;
    return;
  }

  this.selectedFile = file;
  this.showImage = false;

  const reader = new FileReader();

  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };

  reader.readAsDataURL(file);
}

toggleImage(): void {
  this.showImage = !this.showImage;
}

get currentImageName(): string {
  if (!this.imagePreview) return 'Chưa có ảnh';

  if (this.selectedFile) return this.selectedFile.name;

  return this.imagePreview.split('/').pop() || 'Ảnh hiện tại';
}

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('price', this.productForm.value.price.toString());

    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.saving = false;
        alert('Cập nhật sản phẩm thành công!');
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Lỗi cập nhật:', error);
        this.saving = false;
        alert('Cập nhật sản phẩm thất bại!');
      }
    });
  }

  back(): void {
    this.router.navigate(['/']);
  }

  handleImageError(): void {
    this.imagePreview = 'https://via.placeholder.com/500x350?text=No+Image';
  }
}