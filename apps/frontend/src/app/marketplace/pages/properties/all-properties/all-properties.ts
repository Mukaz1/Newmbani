import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { FilterSidebar } from '../../../components/filter-sidebar/filter-sidebar';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertiesService } from '../../../../properties/services/properties.service';
import {
  PropertyCategory,
  HttpResponseInterface,
  PaginatedData,
  Property,
  PropertyApprovalStatus,
} from '@newmbani/types';
import { CategoriesService } from '../../../../admin/pages/categories/services/categories.service';
import { take } from 'rxjs';
import { NotificationService } from '../../../../common/services/notification.service';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { PropertyCard } from '../components/property-card/property-card';
import { SearchInputWidget } from '../../../../common/components/search-input-widget/search-input-widget';
import { MetaService } from '../../../../common/services/meta.service';

interface PropertyQueryParams {
  keyword: string;
  limit: number;
  page: number;
  landlordId?: string;
  categoryId?: string;
  subcategoryId?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  approvalStatus?: PropertyApprovalStatus;
  isAvailable?: boolean;
}
@Component({
  selector: 'app-all-properties',
  standalone: true,
  imports: [
    FilterSidebar,
    FormsModule,
    DataLoading,
    PropertyCard,
    SearchInputWidget,
    NgClass,
  ],
  templateUrl: './all-properties.html',
  styleUrl: './all-properties.scss',
})
export class AllProperties implements OnInit {
  properties = signal<Property[]>([]);
  isLoading = signal(true);
  paginatedData = signal<PaginatedData<any> | null>(null);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  filteredProperties: Property[] = [];
  favorites = signal<Property[]>([]);

  selectedProperty: Property | undefined;
  showFilters = signal(false);
  isMobile = false;
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(-1);

  propertyCategoryOptions: PropertyCategory[] = [];
  categories: PropertyCategory[] = [];
  selectedCategory = 'all';

  propertiesService = inject(PropertiesService);
  categoriesService = inject(CategoriesService);
  destroyRef = inject(DestroyRef);
  route = inject(ActivatedRoute);
  router = inject(Router);
  notificationService = inject(NotificationService);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Properties',
            isClickable: false,
          },
        ],
      },
      title: 'Property Properties',
      description: 'Browse all properties.',
    });
  }
  ngOnInit(): void {
    this.getCategories();
    this.loadFavorites();
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: any) => {
        const queryParams: PropertyQueryParams = {
          keyword: params['keyword'] ?? this.keyword(),
          limit: params['limit'] ? +params['limit'] : this.pageSize(),
          page: params['page'] ? +params['page'] : this.currentPage(),
          landlordId: params['landlordId'] || undefined,
          categoryId: params['categoryId'] || undefined,
          subcategoryId: params['subcategoryId'] || undefined,
          location: params['location'] || undefined,
          minPrice: params['minPrice'] ? +params['minPrice'] : undefined,
          maxPrice: params['maxPrice'] ? +params['maxPrice'] : undefined,
          approvalStatus: params['approvalStatus'] || undefined,
        };
        this.getProperty(queryParams);
      });
  }

  getProperty(query?: PropertyQueryParams) {
    this.isLoading.set(true);

    const params: PropertyQueryParams = {
      keyword: query?.keyword ?? '',
      limit: query?.limit ?? -1,
      page: query?.page ?? 1,
      landlordId: query?.landlordId,
      categoryId: query?.categoryId,
      location: query?.location,
      approvalStatus: query?.approvalStatus ?? PropertyApprovalStatus.APPROVED,
      isAvailable: true,
      subcategoryId: query?.subcategoryId,
      minPrice: query?.minPrice,
      maxPrice: query?.maxPrice,
    };

    this.propertiesService
      .getAllProperties(params)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.paginatedData.set(res.data);
          this.properties.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        },
      });
  }

  getCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res: HttpResponseInterface<PaginatedData<PropertyCategory[]>>) => {
        this.categories = res.data?.data ?? [];
        this.propertyCategoryOptions = res.data?.data ?? [];
      },
      error: (error) => console.error(error),
    });
  }

  toggleFilters(): void {
    this.showFilters.set(!this.showFilters());
  }

  closeFilters(): void {
    this.showFilters.set(false);
  }

  onFiltersChanged(filters?: any): void {
    this.currentPage.set(1);

    // Prevent errors if filters is undefined, null, or not an object
    if (!filters || typeof filters !== 'object') {
      // Reset to just page and limit (clear all filters)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: 1,
          limit: this.pageSize(),
        },
        queryParamsHandling: '',
      });
      return;
    }

    // Clear all current query params by resetting to only page and limit
    const queryParams: any = {
      page: 1,
      limit: this.pageSize(),
    };

    // Populate queryParams from filters, only including non-empty values
    if ('keyword' in filters && !!filters.keyword) {
      queryParams.keyword = filters.keyword;
      this.keyword.set(filters.keyword);
    }
    if ('categoryId' in filters && !!filters.categoryId) {
      queryParams.categoryId = filters.categoryId;
    }
    if ('location' in filters && !!filters.location) {
      queryParams.location = filters.location;
    }
    {
      queryParams.guestsType = JSON.stringify(filters.guestsType);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  // New method to handle property card clicks
  onPropertyCardClick(property: Property): void {
    if (property.slug) {
      this.router.navigate(['/properties', property.slug]);
    } else {
      this.router.navigate(['/properties', property._id]);
    }
  }

  // New method to handle favorite toggle from property card
  onFavoriteToggle(property: Property): void {
    this.toggleFavorite(property);
  }
  isPropertyFavorited(property: Property): boolean {
    return this.favorites().some((fav) => fav._id === property._id);
  }

  toggleFavorite(property: Property): void {
    const currentFavorites = this.favorites();
    const isFav = this.isPropertyFavorited(property);

    if (isFav) {
      this.favorites.set(
        currentFavorites.filter((fav) => fav._id !== property._id),
      );
    } else {
      this.favorites.set([...currentFavorites, property]);
    }
  }

  viewProperty(slug: string) {
    this.router.navigate([slug], { relativeTo: this.route });
  }

  loadFavorites(): void {
    this.favorites.set([]);
  }

  patchQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage(),
        keyword: this.keyword(),
        limit: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }
  onSearchTermChange(value: string) {
    this.keyword.set(value);
    this.currentPage.set(1);
    this.patchQueryParams();
  }
}
