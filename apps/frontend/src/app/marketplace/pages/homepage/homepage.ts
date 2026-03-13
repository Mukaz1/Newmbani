import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  HttpResponseInterface,
  PaginatedData,
  Property,
  PropertyCategory,
} from '@newmbani/types';
import { HeroSection } from '../../components/hero-section/hero-section';
import { Router, RouterLink } from '@angular/router';
// import { Testimonials } from '../../components/testimonials/testimonials';
import { Partners } from '../../components/partners/partners';
import { NotificationService } from '../../../common/services/notification.service';
import { Subject, take, takeUntil } from 'rxjs';
import { PropertyCard } from '../properties/components/property-card/property-card';
import { CategoriesService } from '../../../categories/services/categories.service';
import { MetaService } from '../../../common/services/meta.service';
import { PricePipe } from '../../../common/pipes/price.pipe';
import { NgClass, NgStyle } from '@angular/common';
import { PropertiesService } from '../../../common/services/properties.service';

@Component({
  selector: 'app-homepage',
  imports: [
    HeroSection,
    RouterLink,
    // Testimonials,
    Partners,
    PropertyCard,
    PricePipe,
    NgStyle,
    NgClass,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage implements OnInit {
  properties = signal<Property[]>([]);
  isLoading = signal(true);
  paginatedData = signal<PaginatedData<any> | null>(null);
  favorites = signal<Property[]>([]);
  selectedProperty: Property | undefined;
  propertyCategories = signal<PropertyCategory[] | []>([]);
  pageSize = signal(7);
  currentPage = signal(1);
  keyword = signal<string | undefined>(undefined);

  propertyService = inject(PropertiesService);
  notificationService = inject(NotificationService);
  changeDetectorRef = inject(ChangeDetectorRef);
  categoriesService = inject(CategoriesService);
  destroyRef = inject(DestroyRef);
  destroy$ = new Subject();

  router = inject(Router);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Home',
            isClickable: false,
          },
        ],
      },
      title: 'Home',
      description: 'Discover properties and more at Aluxe.',
    });
  }

  ngOnInit() {
    this.getPropertyCategories();
    this.loadProperties();
  }

  getPropertyCategories(): void {
    this.paginatedData.set(null);
    this.isLoading.set(true);
    this.changeDetectorRef.detectChanges();

    this.categoriesService
      .getCategories({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.keyword(),
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponseInterface) => {
          const data: PaginatedData | undefined = res.data as PaginatedData;
          if (data) {
            this.paginatedData.set(data);
            this.propertyCategories.set(data.data);
            this.isLoading.set(false);
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          this.isLoading.set(false);
        },
      });
  }

  loadProperties(query?: {
    keyword: string;
    limit: number;
    page: number;
    isRestricted: boolean;
    isApproved: boolean;
  }) {
    this.isLoading.set(true);
    this.propertyService
      .getAll({
        keyword: query?.keyword ?? '',
        limit: query?.limit ?? -1,
        page: query?.page ?? 1,
      })
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponseInterface<Property[]>) => {
          this.paginatedData.set(res.data);
          this.properties.set(res.data.data);

          this.isLoading.set(false);
        },
        error: (error: any) => {
          console.log(error);
          this.isLoading.set(false);
        },
      });
  }

  categoryPropertiesMap() {
    const categories = this.propertyCategories();
    const properties = this.properties();

    return categories
      .map((cat) => ({
        ...cat,
        properties: properties.filter(
          (listing) => listing.property.categoryId === cat._id
        ),
      }))
      .filter((cat) => cat.properties.length > 0) // only categories with properties
      .sort((a, b) => b.properties.length - a.properties.length); // descending by count
  }

  onPropertyCardClick(listing: Property): void {
    this.router.navigate(['/properties', listing._id]);
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

  onFavoriteToggle(listing: Property): void {
    this.toggleFavorite(listing.property);
  }

  viewListing(id: string) {
    this.router.navigate([`/properties/${id}`]);
  }

  loadFavorites(): void {
    //   this.propertiesService
    //     .getFavoriteProperties()
    //     .pipe(takeUntilDestroyed(this.destroyRef))
    //     .subscribe({
    //       next: (favorites) => {
    //         this.favorites = favorites.data.data;
    //       },
    //       error: (err) => console.error('Failed to load favorites', err),
    //     });
  }
}
