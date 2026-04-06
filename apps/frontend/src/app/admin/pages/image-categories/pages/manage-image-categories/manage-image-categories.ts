import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PropertyImageCategory,
  CreatePropertyImageCategory,
} from '@newmbani/types';
import { PropertyImagesService } from '../../services/property-image.service';

@Component({
  selector: 'app-manage-image-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-image-categories.html',
  styleUrls: ['./manage-image-categories.scss'],
})
export class ManageImageCategories implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(PropertyImagesService);

  isLoading = signal(false);
  isSaving = signal(false);
  category = signal<CreatePropertyImageCategory & { _id?: string }>({
    name: '',
    minNumber: 1,
    maxNumber: 1,
    maxFileSize: undefined,
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.load(id);
  }

  load(id: string) {
    this.isLoading.set(true);
    this.service.getPropertyImageCategoryById(id).subscribe({
      next: (res) => {
        const data = res?.data as PropertyImageCategory;
        if (data) {
          this.category.set({
            _id: data._id,
            name: data.name,
            minNumber: data.minNumber,
            maxNumber: data.maxNumber,
            maxFileSize: data.maxFileSize,
          });
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load category', err);
        this.isLoading.set(false);
      },
    });
  }

  save() {
    const payload: CreatePropertyImageCategory = {
      name: this.category().name,
      minNumber: this.category().minNumber,
      maxNumber: this.category().maxNumber,
      maxFileSize: this.category().maxFileSize,
    };

    this.isSaving.set(true);
    const id = this.category()._id;
    if (id) {
      this.service.updatePropertyImageCategory(id, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Update failed', err);
          this.isSaving.set(false);
        },
      });
    } else {
      this.service.createPropertyImageCategory(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Create failed', err);
          this.isSaving.set(false);
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
