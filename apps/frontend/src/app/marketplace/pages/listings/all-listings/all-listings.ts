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
  PropertyListing,
} from '@newmbani/types';
import { CategoriesService } from '../../../../categories/services/categories.service';
import { PropertyListingService } from '../../../../property-listing/services/property-listing.service';
import { take } from 'rxjs';
import { NotificationService } from '../../../../common/services/notification.service';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { PropertyCard } from '../components/property-card/property-card';
import { SearchInputWidget } from '../../../../common/components/search-input-widget/search-input-widget';
import { MetaService } from '../../../../common/services/meta.service';

interface PropertyListingsQueryParams {
  keyword: string;
  limit: number;
  page: number;
  hostId?: string;
  categoryId?: string;
  location?: string;
  type?: string;
  checkIn?: string;
  checkOut?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  guestsType?: {
    adults?: number;
    children?: number;
    infants?: number;
    pets?: number;
  };
  isRestricted: boolean;
  isApproved: boolean;
}

@Component({
  selector: 'app-all-listings',
  standalone: true,
  imports: [
    FilterSidebar,
    FormsModule,
    DataLoading,
    PropertyCard,
    SearchInputWidget,
    NgClass,
  ],
  templateUrl: './all-listings.html',
  styleUrl: './all-listings.scss',
})
export class AllListings implements OnInit {
  listings = signal<PropertyListing[]>([]);
  isLoading = signal(true);
  paginatedData = signal<PaginatedData<any> | null>(null);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  properties: Property[] = [];
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
  propertyListingService = inject(PropertyListingService);
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
            linkTitle: 'Property Listings',
            isClickable: false,
          },
        ],
      },
      title: 'Property Listings',
      description: 'Browse all properties.',
    });
  }
  ngOnInit(): void {
    this.getPropertyListings();
    this.getCategories();
    this.loadFavorites();
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const queryParams: PropertyListingsQueryParams = {
          keyword: params['keyword'] ?? this.keyword(),
          limit: params['limit'] ? +params['limit'] : this.pageSize(),
          page: params['page'] ? +params['page'] : this.currentPage(),
          hostId: params['hostId'],
          categoryId: params['categoryId'],
          location: params['location'],
          type: params['type'],
          checkIn: params['checkIn'],
          checkOut: params['checkOut'],
          bedrooms: params['bedrooms'] ? +params['bedrooms'] : undefined,
          bathrooms: params['bathrooms'] ? +params['bathrooms'] : undefined,
          minPrice: params['minPrice'] ? +params['minPrice'] : undefined,
          maxPrice: params['maxPrice'] ? +params['maxPrice'] : undefined,
          guestsType: params['guestsType']
            ? JSON.parse(params['guestsType'])
            : undefined,
          isRestricted: params['isRestricted'],
          isApproved: params['isApproved'],
        };
        this.getPropertyListings(queryParams);
      });
  }

  getPropertyListings(query?: PropertyListingsQueryParams) {
    this.isLoading.set(true);

    const params: PropertyListingsQueryParams = {
      keyword: query?.keyword ?? '',
      limit: query?.limit ?? -1,
      page: query?.page ?? 1,
      hostId: query?.hostId,
      categoryId: query?.categoryId,
      location: query?.location,
      type: query?.type,
      checkIn: query?.checkIn,
      checkOut: query?.checkOut,
      bedrooms: query?.bedrooms,
      bathrooms: query?.bathrooms,
      minPrice: query?.minPrice,
      maxPrice: query?.maxPrice,
      guestsType: query?.guestsType,
      isRestricted: false,
      isApproved: true,
    };

    this.propertyListingService
      .getPublicPropertyListings(params)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.paginatedData.set(res.data);
          this.listings.set(res.data.data);
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
    if ('type' in filters && !!filters.type) {
      queryParams.type = filters.type;
    }
    if ('checkIn' in filters && !!filters.checkIn) {
      queryParams.checkIn = filters.checkIn;
    }
    if ('checkOut' in filters && !!filters.checkOut) {
      queryParams.checkOut = filters.checkOut;
    }
    if (
      'bedrooms' in filters &&
      typeof filters.bedrooms === 'number' &&
      filters.bedrooms > 0
    ) {
      queryParams.bedrooms = filters.bedrooms;
    }
    if (
      'bathrooms' in filters &&
      typeof filters.bathrooms === 'number' &&
      filters.bathrooms > 0
    ) {
      queryParams.bathrooms = filters.bathrooms;
    }
    if (
      'minPrice' in filters &&
      typeof filters.minPrice === 'number' &&
      filters.minPrice > 0
    ) {
      queryParams.minPrice = filters.minPrice;
    }
    if (
      'maxPrice' in filters &&
      typeof filters.maxPrice === 'number' &&
      filters.maxPrice > 0
    ) {
      queryParams.maxPrice = filters.maxPrice;
    }
    if (
      'guestsType' in filters &&
      filters.guestsType &&
      typeof filters.guestsType === 'object' &&
      Object.values(filters.guestsType).some(
        (v) => typeof v === 'number' && v > 0
      )
    ) {
      queryParams.guestsType = JSON.stringify(filters.guestsType);
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: '',
    });
  }

  // New method to handle property card clicks
  onPropertyCardClick(listing: PropertyListing): void {
    if (listing.slug) {
      this.router.navigate(['/listings', listing.slug]);
    } else {
      this.router.navigate(['/listings', listing._id]);
    }
  }

  // New method to handle favorite toggle from property card
  onFavoriteToggle(listing: PropertyListing): void {
    this.toggleFavorite(listing.property);
  }
  isPropertyFavorited(property: Property): boolean {
    return this.favorites().some((fav) => fav._id === property._id);
  }

  toggleFavorite(property: Property): void {
    const currentFavorites = this.favorites();
    const isFav = this.isPropertyFavorited(property);

    if (isFav) {
      this.favorites.set(
        currentFavorites.filter((fav) => fav._id !== property._id)
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
