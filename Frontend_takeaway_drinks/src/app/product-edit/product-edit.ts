import { Component, OnInit, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../services/product.service';
import { SpinnerService } from '../../services/spinner.service';

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
  selectedFile = signal<File | null>(null);
  imagePreview = signal('');
  showImage = signal(false);
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/home']);
      return;
    }
    this.productId = Number(id);
    if (!this.productId) {
      this.router.navigate(['/home']);
      return;
    }
    this.getProduct();
  }

  // Lấy thông tin sản phẩm
  getProduct(): void {
    this.spinnerService.showSpinner();
    this.productService.getProduct(this.productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: any) => {
          if (data.status !== 200 || !data.data) {
            this.spinnerService.hideSpinner();
            alert('Không tìm thấy sản phẩm!');
            this.router.navigate(['/home']);
            return;
          }
          const product = data.data;
          this.productForm.patchValue({
            name: product.name,
            price: Number(product.price),
            category: product.category
          });
          this.imagePreview.set(product.img || '');
          this.spinnerService.hideSpinner();
        },
        error: (error: any) => {
          console.error('Không thể lấy thông tin sản phẩm:', error);
          this.spinnerService.hideSpinner();
          alert('Không thể tải thông tin sản phẩm!');
          this.router.navigate(['/home']);
        }
      });
  }

  get categoryClass(): string {
    const category = this.productForm?.get('category')?.value;
    if (category === 'food') {
      return 'category-food';
    }
    if (category === 'drink') {
      return 'category-drink';
    }
    return '';
  }

  get categoryName(): string {
    const category = this.productForm?.get('category')?.value;
    if (category === 'food') {
      return 'Đồ ăn';
    }
    if (category === 'drink') {
      return 'Đồ uống';
    }
    return '';
  }

  get categoryIcon(): string {
    const category = this.productForm?.get('category')?.value;
    if (category === 'food') {
      return '🍔';
    }
    if (category === 'drink') {
      return '🥤';
    }
    return '📦';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh!');
      this.selectedFile.set(null);
      input.value = '';
      return;
    }
    this.selectedFile.set(file);
    this.showImage.set(false);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  toggleImage(): void {
    this.showImage.update(value => !value);
  }

  get currentImageName(): string {
    const preview = this.imagePreview();
    const file = this.selectedFile();
    if (!preview) {
      return 'Chưa có ảnh';
    }
    if (file) {
      return file.name;
    }
    return preview
      .split('/')
      .pop()
      ?.replace(/^\d+-\d+_/, '') || 'Ảnh hiện tại';
  }

  save(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('name', String(this.productForm.get('name')?.value ?? ''));
    formData.append('price', String(this.productForm.get('price')?.value ?? ''));
    formData.append('category', String(this.productForm.get('category')?.value ?? ''));
    const file = this.selectedFile();
    if (file) {
      formData.append('img', file);
    }
    this.spinnerService.showSpinner();
    this.productService.updateProduct(this.productId, formData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: any) => {
          this.spinnerService.hideSpinner();
          if (response.status === 200) {
            alert('Cập nhật sản phẩm thành công!');
            this.router.navigate(['/home']);
            return;
          }
          alert('Cập nhật sản phẩm thất bại!');
        },
        error: (error: any) => {
          console.error('Lỗi cập nhật:', error);
          this.spinnerService.hideSpinner();
          alert('Cập nhật sản phẩm thất bại!');
        }
      });
  }

  back(): void {
    this.router.navigate(['/detail', this.productId]);
  }

  handleImageError(): void {
    this.imagePreview.set('');
    this.showImage.set(false);
  }
}