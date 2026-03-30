import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  PropertiesSubCategory,
  HttpResponseInterface,
  CreatePropertiesSubCategory,
  NotificationStatusEnum,
  PropertyCategory,
} from '@newmbani/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CategoriesService } from '../../../services/categories.service';
import { NotificationService } from '../../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-property-subcategory-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './property-subcategory-modal.html',
  styleUrl: './property-subcategory-modal.scss',
})
export class PropertiesSubCategoryModal implements OnInit {
  propertiesubcategoryForm: FormGroup;
  propertyCategories = signal<PropertyCategory[]>([]);

  private fb = inject(FormBuilder);
  private dialogRef = inject(DialogRef);
  private destroyRef = inject(DestroyRef);
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);
  data = inject<{ title: string; propertiesubcategory: PropertiesSubCategory }>(
    DIALOG_DATA
  );
  title = this.data?.title;
  isEditing = !!this.data?.propertiesubcategory;

  constructor() {
    this.propertiesubcategoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    if (this.isEditing) {
      // patch form
      this.propertiesubcategoryForm.patchValue({
        name: this.data.propertiesubcategory.name,
        categoryId: this.data.propertiesubcategory.categoryId,
        description: this.data.propertiesubcategory.description,
      });
    }
    this.fetchPropertyCategories();
  }

  private fetchPropertyCategories() {
    this.categoriesService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.propertyCategories.set(res.data.data);
        },
        error: (error) => {
          console.error('Error fetching property categories', error);
        },
      });
  }

  onSubmit() {
    if (this.propertiesubcategoryForm.valid) {
      const payload: CreatePropertiesSubCategory = {
        name: this.propertiesubcategoryForm.get('name')?.value,
        description: this.propertiesubcategoryForm.get('description')?.value,
        categoryId: this.propertiesubcategoryForm.get('categoryId')?.value,
      };

      if (this.isEditing) {
        // update property subcategory
        const id = this.data.propertiesubcategory._id;
        this.categoriesService
          .updateSubcategory(id, payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.notificationService.notify({
                title: 'Success',
                message: 'Property Subcategory updated successfully',
                status: NotificationStatusEnum.SUCCESS,
              });
              this.dialogRef.close((res as  HttpResponseInterface<PropertiesSubCategory>).data);
            },
            error: (error: HttpErrorResponse) => {
              this.notificationService.notify({
                title: 'Error!',
                message: error.error.message,
                status: NotificationStatusEnum.ERROR,
              });
            },
          });
      } else {
        this.categoriesService
          .createSubcategory(payload)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (res) => {
              this.dialogRef.close((res as HttpResponseInterface<CreatePropertiesSubCategory>).data);
            },
            error: (error: HttpErrorResponse) => {
              this.notificationService.notify({
                title: 'Error!',
                message: error.error.message,
                status: NotificationStatusEnum.ERROR,
              });
            },
          });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
