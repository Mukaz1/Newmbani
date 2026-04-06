import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  NotificationStatusEnum,
  PropertyCategory,
  PropertySubCategory,
  User,
} from '@newmbani/types';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../../../common/services/meta.service';
import { CategoriesService } from '../../services/categories.service';
import { PropertySubCategoryModal } from '../modals/property-subcategory-modal/property-subcategory-modal';
import { NotificationService } from '../../../../../common/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-property-category',
  templateUrl: './view-property-category.html',
  styleUrls: ['./view-property-category.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    RouterLink,
    DatePipe,
  ],
})
export class ViewPropertyCategory implements OnInit, OnDestroy {
  propertyCategory: PropertyCategory | null = null;
  propertiesubCategories = signal<PropertySubCategory[]>([]);
  users: User[] | null = null;
  propertyCategoryId: string | null = null;
  destroy$ = new Subject();
  form: FormGroup = new FormGroup({});
  isLoading = false;
  isLoadingSubcategories = false;

  private readonly metaService = inject(MetaService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private notificationService = inject(NotificationService);
  dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

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
            linkTitle: 'View Property Category',
            isClickable: false,
          },
        ],
      },
      title: 'View Property Category',
      description: 'View Property Category',
    });
  }

  ngOnInit(): void {
    this.propertyCategoryId = this.route.snapshot.paramMap.get('id');
    this.changeDetectorRef.detectChanges();
    if (this.propertyCategoryId) {
      this.getCategory(this.propertyCategoryId);
      // Load subcategories for this category
      this.loadSubcategories();
    }
  }

  private getCategory(categoryId: string): void {
    this.categoriesService
      .getCategoryById(categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.propertyCategory = res.data;
          this.changeDetectorRef.detectChanges();
        },
        error: (err: unknown) => {
          console.log(err);
        },
      });
  }

  private loadSubcategories(): void {
    if (!this.propertyCategoryId) return;

    this.isLoadingSubcategories = true;
    this.categoriesService
      .getSubcategories({ categoryId: this.propertyCategoryId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.propertiesubCategories.set(res.data.data || []);
          this.isLoadingSubcategories = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err: unknown) => {
          console.log(err);
          this.isLoadingSubcategories = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  addSubCategoryModal() {
    const modalRef = this.dialog.open(PropertySubCategoryModal);
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const propertiesubcategory: PropertySubCategory =
          res as PropertySubCategory;
        // append propertiesubcategory to propertiesubCategories list
        if (!propertiesubcategory) return;
        this.propertiesubCategories.update((currentSubCategories) => [
          ...currentSubCategories,
          propertiesubcategory,
        ]);
        this.notificationService.notify({
          title: 'Success',
          message: 'Property Subcategory added successfully',
          status: NotificationStatusEnum.SUCCESS,
        });
      });
  }

  viewSubcategory(id: string) {
    this.router.navigate(['/admin/property-categories/subcategories', id]);
  }

  editSubcategory(propertiesubcategory: PropertySubCategory) {
    const modalRef = this.dialog.open(PropertySubCategoryModal, {
      data: {
        title: 'Edit Property Subcategory',
        propertiesubcategory,
      },
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const propertiesubcategory: PropertySubCategory =
          res as PropertySubCategory;
        if (!propertiesubcategory) return;

        this.getCategory(this.propertyCategory!._id);
        this.notificationService.notify({
          title: 'Success',
          message: 'Property Subcategory updated successfully',
          status: NotificationStatusEnum.SUCCESS,
        });
      });
  }

  deleteSubcategory(id: string) {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.categoriesService
        .deleteSubcategory(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.propertiesubCategories.update((currentSubCategories) =>
              currentSubCategories.filter((sub) => sub._id !== id),
            );
            this.notificationService.notify({
              title: 'Success',
              message: 'Subcategory deleted successfully',
              status: NotificationStatusEnum.SUCCESS,
            });
          },
          error: (err: unknown) => {
            console.log(err);
            this.notificationService.notify({
              title: 'Error',
              message: 'Failed to delete subcategory',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    }
  }

  viewUser(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editUser(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
