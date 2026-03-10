import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  PropertyCategory,
  UpdatePropertyCategory,
} from '@newmbani/types';
import { Button } from '../../../common/components/button/button';

import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-edit-property-category',
  templateUrl: './edit-property-category.html',
  styleUrls: ['./edit-property-category.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    Button,
  ],
})
export class EditPropertyCategory implements OnInit, OnDestroy {
  propertyCategoryId: string | null = null;
  propertyCategory: PropertyCategory | null = null;
  isLoading = false;
  editPropertyCategoryForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  destroy$ = new Subject();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly categoriesService = inject(CategoriesService);
  private readonly metaService = inject(MetaService);

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
            linkTitle: 'Edit Property Category',
            isClickable: false,
          },
        ],
      },
      title: 'Edit Property Category',
      description: 'Edit Property Category',
    });
  }

  ngOnInit(): void {
    this.propertyCategoryId = this.route.snapshot.paramMap.get('id');

    if (this.propertyCategoryId) {
      this.categoriesService
        .getCategoryById(this.propertyCategoryId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface<PropertyCategory | null>) => {
            if (res.data) {
              const propertyCategory: PropertyCategory = res.data;
              this.propertyCategory = propertyCategory;
              this.changeDetectorRef.detectChanges();
              this.patchForm();
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching property category:', error);
          },
        });
    }
  }

  patchForm() {
    if (this.propertyCategory) {
      this.editPropertyCategoryForm.patchValue({
        name: this.propertyCategory.name,
        description: this.propertyCategory.description || '',
      });
    }
  }

  discard() {
    if (this.propertyCategory) {
      this.editPropertyCategoryForm.patchValue({
        name: this.propertyCategory.name,
        description: this.propertyCategory.description || '',
      });
    }
  }

  updatePropertyCategory(): void {
    this.isLoading = true;
    if (this.editPropertyCategoryForm.valid && this.propertyCategoryId) {
      const { name, description } = this.editPropertyCategoryForm.value;

      const payload: UpdatePropertyCategory = {
        name,
        description,
      };

      this.categoriesService
        .updateCategory(this.propertyCategoryId, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: HttpResponseInterface<PropertyCategory | null>) => {
            this.isLoading = false;
            if (response.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
              this.notificationsService.notify({
                title: 'Error!',
                message: response.message,
                status: NotificationStatusEnum.ERROR,
              });
              return;
            }

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message,
              status: NotificationStatusEnum.SUCCESS,
            });

            this.router.navigate([
              '/admin/property-categories/categories/',
              this.propertyCategoryId,
            ]);
            return;
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            this.notificationsService.notify({
              title: 'Error!',
              message: error.message,
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      this.isLoading = false;
      this.notificationsService.notify({
        title: 'Error!',
        message: 'Check your Property Category update form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
