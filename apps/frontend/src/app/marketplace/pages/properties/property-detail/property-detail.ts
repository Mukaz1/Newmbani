import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  PLATFORM_ID,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NotificationStatusEnum,
  Property,
  PropertyImage,
  PropertyImageApprovalStatus,
} from '@newmbani/types';
import { take } from 'rxjs';
import { NotificationService } from '../../../../common/services/notification.service';
import { DataLoading } from '../../../../common/components/data-loading/data-loading';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../../common/components/button/button';
import { MetaService } from '../../../../common/services/meta.service';
import { Dialog } from '@angular/cdk/dialog';
import { ViewImagesModal } from '../components/view-images-modal/view-images-modal';
import { PropertiesService } from '../../../../properties/services/properties.service';
import { FormatLabelPipe } from '../../../../common/pipes/format-label.pipe';
import { PropertyLocation } from '../property-location/property-location';
import { PropertyCard } from '../components/property-card/property-card';
import { PricingCard } from '../components/pricing-card/pricing-card';

@Component({
  selector: 'app-property-detail',
  imports: [
    DataLoading,
    FormsModule,
    Button,
    FormatLabelPipe,
    PropertyLocation,
    PropertyCard,
    PricingCard,
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.scss',
})
export class PropertyDetail implements OnInit {
  property = signal<Property | null>(null);
  similarProperties = signal<Property[]>([]);
  isLoading = signal(true);
  isSimilarPropertiesLoading = signal(false);
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  favorites = signal<Property[]>([]);

  lightboxOpen = signal(false);
  lightboxIndex = signal(0);
  selectedImageIndex = signal(0);
  showContactForm = signal(false);

  contactForm = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    message: '',
  };

  propertyImages = computed(() => this.property()?.images);
  private propertyService = inject(PropertiesService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private readonly metaService = inject(MetaService);
  private dialog = inject(Dialog);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'View Property',
            isClickable: false,
          },
        ],
      },
      title: 'View Property',
      description: 'View this property property.',
    });
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params: any) => {
        if (params['id']) {
          this.getPropertyDetails(params['id']);
        }
      });
  }

  getPropertyDetails(id: string): void {
    this.isLoading.set(true);
    this.propertyService
      .getPropertyByIdOrSlug(id)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.property.set(res.data);
            this.loadSimilarProperties();
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.notificationService.notify({
            message: 'Property property not found',
            status: NotificationStatusEnum.ERROR,
            title: 'Error',
          });
          this.isLoading.set(false);
          this.router.navigate(['/properties']);
        },
      });
  }

  loadSimilarProperties(): void {
    const currentProperty = this.property();
    if (!currentProperty) return;

    this.isSimilarPropertiesLoading.set(true);
    this.propertyService
      .getAllProperties({
        keyword: '',
        limit: 4,
        page: 1,
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const filtered = res.data.data
            .filter((prop) => prop._id !== currentProperty._id)
            .slice(0, 3);
          this.similarProperties.set(filtered);
          this.isSimilarPropertiesLoading.set(false);
        },
        error: () => {
          this.isSimilarPropertiesLoading.set(false);
        },
      });
  }

  toggleContactForm(): void {
    this.showContactForm.set(!this.showContactForm);
  }

  submitContactForm(): void {
    if (
      !this.contactForm.firstName ||
      !this.contactForm.lastName ||
      !this.contactForm.email ||
      !this.contactForm.message
    ) {
      this.notificationService.notify({
        message: 'Please fill in all required fields',
        status: NotificationStatusEnum.ERROR,
        title: 'Validation Error',
      });
      return;
    }

    this.notificationService.notify({
      message: 'Your message has been sent successfully!',
      status: NotificationStatusEnum.SUCCESS,
      title: 'Message Sent',
    });

    this.contactForm = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      message: '',
    };

    this.showContactForm.set(false);
  }

  navigateToSimilarProperty(id: string): void {
    this.router.navigate(['/propertys', id]);
  }

  goBack(): void {
    this.router.navigate(['/propertys']);
  }

  shareProperty(): void {
    if (this.isBrowser && navigator.share) {
      const property = this.property();
      if (property) {
        navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      }
    } else if (this.isBrowser) {
      navigator.clipboard.writeText(window.location.href);
      this.notificationService.notify({
        message: 'Property link copied to clipboard',
        status: NotificationStatusEnum.SUCCESS,
        title: 'Shared',
      });
    }
  }

  getPropertyImages(): PropertyImage[] {
    const property = this.property();
    if (property && Array.isArray(property.images)) {
      // Only include images with approvalStatus === 'APPROVED'
      const approvedImages: PropertyImage[] = property.images;

      // Group approved images by categoryId
      const imagesByCategory: { [categoryId: string]: PropertyImage[] } = {};
      const uncategorized: PropertyImage[] = [];

      for (const img of approvedImages) {
        const categoryId =
          img.propertyImageCategory && img.propertyImageCategory._id
            ? img.propertyImageCategory._id
            : '';

        if (categoryId) {
          if (!imagesByCategory[categoryId]) {
            imagesByCategory[categoryId] = [];
          }
          imagesByCategory[categoryId].push(img);
        } else {
          uncategorized.push(img);
        }
      }

      // Prepare in "row-wise join" style: first all index 0s, then all index 1s, etc.
      const categoryArrays = Object.values(imagesByCategory);
      if (uncategorized.length) categoryArrays.push(uncategorized);

      const result: PropertyImage[] = [];
      let i = 0;
      let keepGoing = true;

      while (keepGoing) {
        keepGoing = false;
        for (const catArr of categoryArrays) {
          if (catArr[i]) {
            result.push(catArr[i]);
            keepGoing = true;
          }
        }
        i++;
      }

      return result;
    }
    return [];
  }

  /**
   * Returns the images together with their propertyImageCategory name, for display purposes.
   * Each entry is { image: PropertyImage, categoryName: string }
   */
  getPropertyImagesWithCategory(): {
    image: PropertyImage;
    categoryName: string;
  }[] {
    const property = this.property();
    if (!property || !property || !property.images) return [];

    return property.images.map((img) => ({
      image: img,
      categoryName:
        (img.propertyImageCategory && img.propertyImageCategory.name) || '', // fallback if propertyImageCategory or its name is missing
    }));
  }

  touchStartX = 0;
  touchEndX = 0;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    // Swipe distance threshold (e.g., 50px swipe)
    const minSwipeDistance = 50;
    const deltaX = this.touchEndX - this.touchStartX;

    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) {
        // Swiped left
        this.nextImage();
      } else {
        // Swiped right
        this.previousImage();
      }
    }

    // Reset swipe positions
    this.touchStartX = 0;
    this.touchEndX = 0;
  }
  getCurrentImage(): PropertyImage {
    const images = this.getPropertyImages();
    return images[this.selectedImageIndex()] || images[0];
  }

  onSimilarPropertyKeydown(event: KeyboardEvent, id: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToSimilarProperty(id);
    }
  }

  // Lightbox and image navigation merged functionality

  /**
   * Opens the lightbox at a specific image (also sets current main image).
   */
  openLightbox(index: number): void {
    const images = this.getPropertyImages();
    if (images && index >= 0 && index < images.length) {
      this.selectedImageIndex.set(index);
      this.lightboxIndex.set(index);
      this.lightboxOpen.set(true);
    }
  }

  /**
   * Closes the lightbox.
   */
  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  /**
   * Moves to the previous image.
   * This updates both the main image and lightbox (if open).
   */
  previousImage(): void {
    const images = this.getPropertyImages();
    if (images.length > 0) {
      const newIndex =
        (this.selectedImageIndex() - 1 + images.length) % images.length;
      this.selectedImageIndex.set(newIndex);

      if (this.lightboxOpen()) {
        this.lightboxIndex.set(newIndex);
      }
    }
  }

  /**
   * Moves to the next image.
   * This updates both the main image and lightbox (if open).
   */
  nextImage(): void {
    const images = this.getPropertyImages();
    if (images.length > 0) {
      const newIndex = (this.selectedImageIndex() + 1) % images.length;
      this.selectedImageIndex.set(newIndex);

      if (this.lightboxOpen()) {
        this.lightboxIndex.set(newIndex);
      }
    }
  }

  /**
   * Called from main image or thumbnail click to select an image (and possibly open the lightbox).
   */
  selectImage(index: number, openLightbox = false): void {
    const images = this.getPropertyImages();
    if (images && index >= 0 && index < images.length) {
      this.selectedImageIndex.set(index);
      if (openLightbox) {
        this.lightboxIndex.set(index);
        this.lightboxOpen.set(true);
      }
    }
  }

  // Keyboard navigation for lightbox
  onLightboxKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }

  getThumbnailImages(): PropertyImage[] {
    return this.getPropertyImages();
  }

  onPropertyCardClick(property: Property): void {
    this.router.navigate(['/propertys', property._id]);
  }

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
  viewAllImages() {
    this.dialog.open(ViewImagesModal, {
      data: { property: this.property() },
    });
  }
}
