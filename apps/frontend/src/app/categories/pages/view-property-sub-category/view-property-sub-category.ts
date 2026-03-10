import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  HttpResponseInterface,
  PropertyCategory,
  PropertiesSubCategory,
} from '@newmbani/types';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../common/services/meta.service';
import { CategoriesService } from '../../services/categories.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-property-sub-category',
  templateUrl: './view-property-sub-category.html',
  styleUrls: ['./view-property-sub-category.scss'],
  imports: [FormsModule, ReactiveFormsModule, DataLoading, DatePipe],
})
export class ViewPropertySubcategory implements OnInit {
  subCategoryId: string | null = null;
  subcategory: PropertiesSubCategory | null = null;
  category: PropertyCategory | null = null;
  isLoading = true;

  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly metaService = inject(MetaService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Subcategories',
            isClickable: true,
            link: '/admin/property-categories/subcategories',
          },
          {
            linkTitle: 'Subcategory Profile',
            isClickable: false,
          },
        ],
      },
      title: 'Subcategory Profile',
      description: 'Property Subcategory Profile',
    });
  }

  ngOnInit(): void {
    this.subCategoryId = this.route.snapshot.paramMap.get('id');
    if (this.subCategoryId) {
      this.categoriesService
        .getSubcategoryById(this.subCategoryId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: HttpResponseInterface<PropertiesSubCategory | null>) => {
            if (res.data) {
              this.subcategory = res.data;
              this.isLoading = false;
              this.changeDetectorRef.detectChanges();
              this.metaService.setMeta({
                breadcrumb: {
                  links: [
                    {
                      linkTitle: 'Property Subcategories',
                      isClickable: true,
                      link: '/admin/property-categories/subcategories',
                    },
                    {
                      linkTitle: `${this.subcategory?.name}`,
                      isClickable: false,
                    },
                  ],
                },
                title: `${this.subcategory?.name} Profile`,
                description: 'Property Subcategory Profile',
              });
              // Load parent category to resolve name
              this.loadCategory(this.subcategory.categoryId);
            }
          },
          error: () => {
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          },
        });
    }
  }

  private loadCategory(categoryId?: string) {
    if (!categoryId) return;
    this.categoriesService
      .getCategoryById(categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponseInterface<PropertyCategory | null>) => {
          this.category = res.data || null;
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  getCategoryName(): string {
    return this.category?.name || 'N/A';
  }
}
