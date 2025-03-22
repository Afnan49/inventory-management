import { Component, OnInit, inject, signal } from '@angular/core';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderTitleComponent } from '../../../shared/components/header-title/header-title.component';
import { UploadService } from '../../../shared/services/upload.service';
import { InputComponent } from '../../../shared/components/input/input.component';
import { TextareaComponent } from '../../../shared/components/textarea/textarea.component';
@Component({
  selector: 'app-inventory-add',
  templateUrl: './inventory-add.component.html',
  styleUrls: ['./inventory-add.component.scss'],
  standalone: true,
  imports: [
    FileUploadModule,
    ButtonModule,
    ToastModule,
    ReactiveFormsModule,
    CommonModule,
    HeaderTitleComponent,
    InputComponent,
    TextareaComponent,
  ],
  providers: [MessageService],
})
export class InventoryAddComponent implements OnInit {
  // ===< properties >===
  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private inventoryService = inject(InventoryService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  productId = signal<string>('');
  productForm: FormGroup;
  thumbnailUrl: string = '';
  additionalImages: string[] = [];
  isUploading: boolean = false;

  // ===< constructor >===
  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
      priceAfterDiscount: [''],
      description: ['', [Validators.required]],
      thumbnail: ['', [Validators.required]],
      images: [[], [Validators.required, Validators.minLength(1)]],
      features: this.fb.array(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  // ===< on init >===
  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
    if (this.productId()) {
      this.getProductById(this.productId());
    } else {
      if (this.features.length === 0) {
        this.addFeature();
      }
    }
  }
  // ===< get product by id >===
  getProductById(id: string) {
    this.inventoryService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.thumbnailUrl = product.thumbnail;
        this.additionalImages = product.images;
        this.features.clear();
        product.features?.forEach((feature: string) => {
          this.features.push(this.fb.control(feature));
        });
      },
      error: (error) => {
        console.error('Error fetching product:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch product details',
        });
      },
    });
  }
  onThumbnailUpload(event: any) {
    const file = event.files[0];
    if (!file) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No file selected',
      });
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload only image files',
      });
      return;
    }
    if (file.size > 1000000) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File size should not exceed 1MB',
      });
      return;
    }

    this.isUploading = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Upload Started',
      detail: 'Uploading thumbnail...',
    });

    this.uploadService.uploadImage(file).subscribe({
      next: (url) => {
        if (!url) {
          throw new Error('No URL received from upload service');
        }
        this.thumbnailUrl = url;
        this.productForm.patchValue({ thumbnail: url });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Thumbnail uploaded successfully',
        });
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload thumbnail. Please try again.',
        });
        this.isUploading = false;
      },
    });
  }

  // ===< on images upload >===
  onImagesUpload(event: any) {
    const files = event.files;
    if (!files || files.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No files selected',
      });
      return;
    }
    const invalidFiles = files.filter(
      (file: File) => !file.type.startsWith('image/') || file.size > 1000000
    );
    if (invalidFiles.length > 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail:
          'Some files are invalid. Please ensure all files are images under 1MB',
      });
      return;
    }

    this.isUploading = true;
    this.messageService.add({
      severity: 'info',
      summary: 'Upload Started',
      detail: `Uploading ${files.length} images...`,
    });

    this.uploadService.uploadMultipleImages(files).subscribe({
      next: (urls) => {
        if (!urls || urls.length === 0) {
          throw new Error('No URLs received from upload service');
        }
        this.additionalImages = [...this.additionalImages, ...urls];
        this.productForm.patchValue({ images: this.additionalImages });
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${urls.length} images uploaded successfully`,
        });
        this.isUploading = false;
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to upload images. Please try again.',
        });
        this.isUploading = false;
      },
    });
  }

  removeImage(index: number) {
    this.additionalImages.splice(index, 1);
    this.productForm.patchValue({ images: this.additionalImages });
  }
  // ===< get features >===
  get features(): FormArray {
    return this.productForm.get('features') as FormArray;
  }
  // ===< add feature >===
  addFeature() {
    this.features.push(this.fb.control('', Validators.required));
  }
  // ===< remove feature >===
  removeFeature(index: number) {
    this.features.removeAt(index);
  }
  // ===< on submit >===
  onSubmit() {
    if (this.productForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly',
      });
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });

      return;
    }

    if (this.isUploading) {
      this.messageService.add({
        severity: 'info',
        summary: 'Please wait',
        detail: 'Images are still uploading...',
      });
      return;
    }

    const product = {
      ...this.productForm.value,
      features: this.features.value,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    const action = this.productId()
      ? this.inventoryService.updateProduct(this.productId(), product)
      : this.inventoryService.addProduct(product);

    action.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.productId()
            ? 'Product updated successfully'
            : 'Product added successfully',
        });
        this.router.navigate(['/inventory']);
      },
      error: (error) => {
        console.error(this.productId() ? 'Update error:' : 'Add error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.productId()
            ? 'Failed to update product. Please try again.'
            : 'Failed to add product. Please try again.',
        });
      },
    });
  }
}
