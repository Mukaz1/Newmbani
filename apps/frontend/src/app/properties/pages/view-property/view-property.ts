import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  inject,
  OnInit,
  signal,
  OnDestroy,
  computed,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import {
  HttpResponseInterface,
  Property,
  NotificationStatusEnum,
  PropertyImageCategory,
  PropertyImage,
} from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { PropertyImagesService } from '../../services/property-image.service';
import { isPlatformBrowser } from '@angular/common';
import { PropertyVerificationModal } from '../../modals/property-verification-modal/property-verification-modal';
import { ChangeImageCategory } from '../../modals/change-image-category/change-image-category';
import { PaginatedData, PropertyApprovalStatus } from '@newmbani/types';
import { PropertiesService } from '../../services/properties.service';
import { UploadImages } from '../../modals/upload-images/upload-images';

@Component({
  selector: 'app-view-property',
  standalone: true,
  imports: [
  ],
  templateUrl: './view-property.html',
  styleUrl: './view-property.scss',
})
export class ViewProperty implements OnInit, OnDestroy {
  private readonly propertiesService = inject(PropertiesService);
  private readonly metaService = inject(MetaService);
  private readonly notificationService = inject(NotificationService);
  private readonly propertyImageCategoriesService = inject(
    PropertyImagesService
  );
  private readonly dialog = inject(Dialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  // Signals
  propertyId = signal<string | null>(null);
  property = signal<Property | null>(null);
  imageCategories = signal<PropertyImageCategory[] | []>([]);
  propertyImages = computed(() => this.property()?.images);

  isLoading = signal(false);
  isDesktop = signal(false);
  error = signal<string | null>(null);
  
  lightboxOpen = signal(false);
  lightboxIndex = signal(0);
  lightboxCategoryImages = signal<PropertyImage[] | null>(null);

  currentImage = signal(0);
  destroy$ = new Subject<void>();
  // editMode = signal(false;
  PropertyApprovalStatus = PropertyApprovalStatus;

  // In your component class, replace the arrow function with:
  filteredImagesByCategory(categoryId: string): PropertyImage[] {
    const list = this.property()?.images || [];
    return list.filter((img: PropertyImage) => img.propertyImageCategoryId === categoryId);
  }

  removeAmenityForm = new FormGroup({});
  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Details',
            isClickable: false,
          },
        ],
      },
      title: 'Property Details',
      description: 'Property Details',
    });
    if (this.isBrowser) {
      this.checkScreen();
      window.addEventListener('resize', () => this.checkScreen());
    }
  }

  ngOnInit(): void {
    this.propertyId.set(this.route.snapshot.paramMap.get('id'));
    const propertyId = this.propertyId();
    if (propertyId) {
      this.getProperty(propertyId);
    }
    this.fetchImageCategories();
  }

  fetchImageCategories() {
    this.isLoading.set(true);
    this.propertyImageCategoriesService
      .getPropertyImageCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:HttpResponseInterface<PaginatedData<PropertyImageCategory[]>>) => {
          this.imageCategories.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error!',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  /**
   * Gets a property by ID from the server.
   */
  getProperty(propertyId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.propertiesService
      .getPropertyByIdOrSlug(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponseInterface<Property>) => {
          // Try different response structure checks
          if (response && response.data) {
            this.property.set(response.data);
          } else if (
            response &&
            typeof response === 'object' &&
            'name' in response
          ) {
            // Sometimes the property is directly in the response
            this.property.set(response as any);
          } else {
            this.error.set('Failed to load property data');
          }
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error('API Error occurred:', error);
          this.isLoading.set(false);
          const errorMessage =
            error.error?.message || error.message || 'Failed to load property';
          this.error.set(errorMessage);
        },
      });
  }

  goBack() {
    // Go back to bookings list
    if (this.authService.getUserType().admin) {
      this.router.navigate(['/admin/properties']);
    } else if (this.authService.getUserType().landlord) {
      this.router.navigate(['/landlord/properties']);
    }
  }
  editProperty(id: string) {
    this.router.navigate([`/landlord/properties'/${id}/edit`]);
  }

  getStatusClass(status?: PropertyApprovalStatus): string {
    switch (status) {
      case PropertyApprovalStatus.APPROVED:
        return 'bg-green-100 text-green-800';
      case PropertyApprovalStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case PropertyApprovalStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Gets the property image link for display
   */
  getPropertyImageLink(currentImage: number): string {
    const prop = this.property();
    if (!prop) {
      return '/assets/img/missing-property-image.jpg';
    } else if (
      prop.images &&
      prop.images.length > 0 &&
      prop.images[currentImage] &&
      typeof prop.images[currentImage].link === 'string'
    ) {
      return (
        prop.images[currentImage].link ??
        '/assets/img/missing-property-image.jpg'
      );
    } else {
      return '/assets/img/missing-property-image.jpg';
    }
  }

  /**
   * Changes the current image to the one with the given index.
   */
  changeCurrentImage(index: number): void {
    const prop = this.property();
    if (prop?.images && index >= 0 && index < prop.images.length) {
      this.currentImage.set(index);
    }
  }
  /**
   * Opens the upload images modal
   */
  uploadImagesModal(categoryId: string): void {
    const propertyId = this.property()?._id.toString();

    if (!propertyId) return;
    if (!categoryId) return;

    const modalRef = this.dialog.open(UploadImages, {
      disableClose: true,
      data: { propertyId, propertyImageCategoryId: categoryId },
    });
    // No additional logic needed here; the modal will handle the flow.

    modalRef.closed.subscribe((result: any) => {
      if (result) {
        // Refresh the property data to show new images
        const property = result as Property;
        this.property.set(property);
        this.getProperty(propertyId);
      }
    });
  }

  removeImage(propertyImageId: string | null): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete this image?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full !hover:bg-red-600 transition-colors',
      },
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((confirmed:boolean) => {
      if (confirmed) {
        if (propertyImageId) {
          this.propertiesService
            .removePropertyImage(propertyImageId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.notificationService.notify({
                  title: 'Deleted',
                  message: 'Property Image deleted successfully',
                  status: NotificationStatusEnum.SUCCESS,
                });
                const propertyId = this.propertyId();
                if (propertyId) {
                  this.getProperty(propertyId);
                }
              },
              error: (err: HttpErrorResponse) => {
                this.notificationService.notify({
                  title: 'Error',
                  message: err.error.message,
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        }
      }
    });
  }



  // Lightbox functionality
  openLightbox(index: number, categoryId?: string): void {
    const prop = this.property();

    let images = this.lightboxCategoryImages() ?? [];
    if (categoryId) {
      images = this.filteredImagesByCategory(categoryId);
    } else {
      images = prop?.images ?? [];
    }
    if (images && index >= 0 && index < images.length) {
      this.lightboxCategoryImages.set(images);
      this.lightboxIndex.set(index);
      this.lightboxOpen.set(true);
    }
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
  }

  // Navigation methods for lightbox
  previousImage(): void {
    const images = this.lightboxCategoryImages() ?? [];
    const currentIndex = this.lightboxIndex();
    if (images.length > 0) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      this.lightboxIndex.set(newIndex);
    }
  }

  nextImage(): void {
    const images = this.lightboxCategoryImages() ?? [];
    const currentIndex = this.lightboxIndex();
    if (images.length > 0) {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      this.lightboxIndex.set(newIndex);
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

  deleteProperty(property?: Property | null): void {
    if (!property) return;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${property.title}"?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full !hover:bg-red-600 transition-colors',
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed:boolean) => {
        if (confirmed ) {
          this.propertiesService
            .deleteProperty(property._id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.notify({
                  title: 'Deleted',
                  message: 'Property deleted successfully',
                  status: NotificationStatusEnum.SUCCESS,
                });

                // Navigate back to properties list after deletion
                this.router.navigate(['/landlord/properties']);
              },
              error: (err: Error) => {
                this.notificationService.notify({
                  title: 'Error',
                  message: err.message,
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        }
      });
  }

  selectMode = false;
  selectedAmenities = new Set<string>();

  toggleSelectMode() {
    this.selectMode = !this.selectMode;

    if (!this.selectMode) {
      this.selectedAmenities.clear();
    }
  }


  approveProperty(property: Property) {
    const dialogRef = this.dialog.open(PropertyVerificationModal, {
      data: { property },
    });

    dialogRef.closed.subscribe(() => {
      // Optionally check result if needed
      if (this.property()) {
        this.getProperty(this.property()!._id);
      }
    });
  }

  reviewPropertyImage(propertyImage: PropertyImage) {
    const dialogRef = this.dialog.open(PropertyImageReviewModal, {
      data: { propertyImage, propertyName: this.property()!.name },
    });

    dialogRef.closed.subscribe((result: unknown) => {
      const propertyImage = result as PropertyImage;
      if (propertyImage && propertyImage.propertyId) {
        this.getProperty(propertyImage.propertyId);
      }
    });
  }

  changePropertyImageCategory(propertyImage: PropertyImage) {
    const dialogRef = this.dialog.open(ChangeImageCategory, {
      data: { propertyImage, propertyName: this.property()!.name },
    });

    dialogRef.closed.subscribe((result: unknown) => {
      const propertyImage = result as PropertyImage;
      if (propertyImage && propertyImage.propertyId) {
        this.getProperty(propertyImage.propertyId);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getUserType().admin;
  }
  isLandlord(): boolean {
    return this.authService.getUserType().landlord;
  }
  checkScreen() {
    this.isDesktop.set(window.innerWidth >= 1024);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
