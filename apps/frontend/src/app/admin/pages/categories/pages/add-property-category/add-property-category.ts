import { Component, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreatePropertyCategory,
  CreatePropertySubCategory,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  PropertyCategory,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import { MetaService } from '../../../../../common/services/meta.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'app-add-property-category',
  templateUrl: './add-property-category.html',
  styleUrls: ['./add-property-category.scss'],
  imports: [FormsModule, ReactiveFormsModule, Button],
})
export class AddPropertyCategory implements OnDestroy {
  isLoading = false;
  registerPropertyCategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    subCategories: new FormArray([]),
  });
  destroy$ = new Subject();

  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationService);
  private readonly metaService = inject(MetaService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly authService = inject(AuthService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Categories',
            isClickable: true,
            link: '/admin/property-categories/categories',
          },
          {
            linkTitle: 'Create New Category',
            isClickable: false,
          },
        ],
      },
      title: 'Create New Category',
      description: 'Create a New Category',
    });
  }

  get subCategoriesControls() {
    return (this.registerPropertyCategoryForm.get('subCategories') as FormArray)
      .controls as FormGroup[];
  }

  addSubcategory(): void {
    const subcategoryForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
    });

    const subCategoriesArray = this.registerPropertyCategoryForm.get(
      'subCategories',
    ) as FormArray;
    subCategoriesArray.push(subcategoryForm);

    this.changeDetectorRef.detectChanges();
  }

  removeSubcategory(index: number): void {
    const subCategoriesArray = this.registerPropertyCategoryForm.get(
      'subCategories',
    ) as FormArray;
    subCategoriesArray.removeAt(index);

    this.changeDetectorRef.detectChanges();
  }

  resetForm(): void {
    this.registerPropertyCategoryForm.reset();
    // Clear all subcategories
    const subCategoriesArray = this.registerPropertyCategoryForm.get(
      'subCategories',
    ) as FormArray;
    while (subCategoriesArray.length !== 0) {
      subCategoriesArray.removeAt(0);
    }
    this.changeDetectorRef.detectChanges();
  }

  private validateSubcategories(
    subcategories: any[],
  ): CreatePropertySubCategory[] {
    return subcategories
      .filter((sub) => sub.name && sub.name.trim().length > 0) // Filter out empty names
      .map((sub) => ({
        name: sub.name.trim(),
        description: sub.description ? sub.description.trim() : '',
        categoryId: '', // Will be set after category creation
      }));
  }

  private createSubcategories(
    categoryId: string,
    subcategories: CreatePropertySubCategory[],
  ) {
    if (subcategories.length === 0) {
      return of([]);
    }

    // Set the categoryId for each subcategory
    const subcategoriesWithCategoryId = subcategories.map((sub) => ({
      ...sub,
      categoryId,
    }));

    // Create all subcategories in parallel
    const subcategoryRequests = subcategoriesWithCategoryId.map((sub) =>
      this.categoriesService.createSubcategory(sub),
    );

    return forkJoin(subcategoryRequests);
  }

  createPropertyCategory(): void {
    this.isLoading = true;

    // Validate main form
    if (!this.registerPropertyCategoryForm.get('name')?.valid) {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      this.notificationsService.notify({
        title: 'Missing Fields!',
        message: 'Category name is required',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    // Check subcategories validation
    const subCategoriesArray = this.registerPropertyCategoryForm.get(
      'subCategories',
    ) as FormArray;
    const hasInvalidSubcategory = subCategoriesArray.controls.some(
      (control) => {
        const nameControl = control.get('name');
        return nameControl?.value?.trim() && nameControl?.invalid;
      },
    );

    if (hasInvalidSubcategory) {
      this.isLoading = false;
      this.changeDetectorRef.detectChanges();
      this.notificationsService.notify({
        title: 'Invalid Subcategories!',
        message:
          'Please fill in all required subcategory fields or remove empty ones',
        status: NotificationStatusEnum.ERROR,
      });
      return;
    }

    const formValue = this.registerPropertyCategoryForm.value;
    const { name, description, subCategories } = formValue;

    // Validate and clean subcategories
    const validSubcategories = this.validateSubcategories(subCategories || []);

    // Create category payload (without subcategories since they're handled separately)
    const categoryPayload: CreatePropertyCategory = {
      name: name.trim(),
      description: description ? description.trim() : '',
    };

    // First, create the category
    this.categoriesService
      .createCategory(categoryPayload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categoryResponse: any) => {
          if (categoryResponse.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
            return this.notificationsService.notify({
              title: 'Error!',
              message: categoryResponse.message,
              status: NotificationStatusEnum.ERROR,
            });
          }

          const createdCategory: PropertyCategory = categoryResponse.data;

          // If there are subcategories to create, create them
          if (validSubcategories.length > 0) {
            this.createSubcategories(createdCategory._id, validSubcategories)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (subcategoryResponses) => {
                  this.isLoading = false;
                  this.changeDetectorRef.detectChanges();

                  const successfulSubcategories = subcategoryResponses.filter(
                    (response) => response && response.statusCode !== 400,
                  ).length;

                  let message = 'Category created successfully';
                  if (successfulSubcategories > 0) {
                    message += ` with ${successfulSubcategories} subcategory(ies)`;
                  }

                  this.notificationsService.notify({
                    title: 'SUCCESS!',
                    message,
                    status: NotificationStatusEnum.SUCCESS,
                  });

                  this.router.navigateByUrl(
                    `admin/property-categories/categories/${createdCategory._id}`,
                  );
                },
                error: (error: HttpErrorResponse) => {
                  this.isLoading = false;
                  this.changeDetectorRef.detectChanges();

                  // Category was created but subcategories failed
                  this.notificationsService.notify({
                    title: 'Partial Success',
                    message:
                      'Category created successfully, but some subcategories failed to create. You can add them later.',
                    status: NotificationStatusEnum.WARNING,
                  });

                  // Still navigate to the category page
                  this.router.navigateByUrl(
                    `admin/property-categories/categories/${createdCategory._id}`,
                  );
                },
              });
          } else {
            // No subcategories to create
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: 'Category created successfully',
              status: NotificationStatusEnum.SUCCESS,
            });

            this.router.navigateByUrl(
              `admin/property-categories/categories/${createdCategory._id}`,
            );
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();

          this.notificationsService.notify({
            title: 'Error!',
            message:
              error.error?.message ||
              error.message ||
              'An error occurred while creating the category',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
