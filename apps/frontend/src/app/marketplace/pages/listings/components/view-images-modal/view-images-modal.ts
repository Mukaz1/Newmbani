import {
  NotificationStatusEnum,
  PropertyImageCategory,
  PropertyListing,
  PropertyImage,
  PropertyImageApprovalStatus,
} from '@newmbani/types';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../../common/services/notification.service';
import { PropertyImagesService } from '../../../../../properties/services/property-image.service';

@Component({
  selector: 'app-view-images-modal',
  imports: [],
  templateUrl: './view-images-modal.html',
  styleUrl: './view-images-modal.scss',
})
export class ViewImagesModal implements OnInit {
  isLoading = signal(true);
  listing = signal<PropertyListing | null>(null);
  imageCategories = signal<PropertyImageCategory[] | []>([]);
  lightboxIndex = signal<number>(0);
  lightboxOpen = signal(false);

  selectedCategoryId = signal<string | null>(null);

  lightboxCategoryImages = signal<PropertyImage[] | null>(null);

  private data = inject(DIALOG_DATA) as {
    listing: PropertyListing;
  };

  private readonly notificationService = inject(NotificationService);
  private readonly propertyImageCategoriesService = inject(
    PropertyImagesService
  );

  private readonly dialogRef = inject(DialogRef);
  private destroyRef = inject(DestroyRef);

  currentYear = new Date().getFullYear();

  /**
   * Returns images for a category, ordering approved first before non-approved.
   * Only returns images with approvalStatus === APPROVED at the top of the array.
   */
  filteredImagesByCategory = (categoryId: string) => {
    const list: PropertyImage[] = this.listing()?.property?.images || [];
    // Group images by approvalStatus, with approved at the top
    const approvedImages = list.filter(
      (img) =>
        img.propertyImageCategoryId === categoryId &&
        img.approvalStatus === PropertyImageApprovalStatus.APPROVED
    );
    return approvedImages;
  };

  // Only show categories that have at least one image for the property (approved or not)
  categoriesWithImages = computed(() => {
    const categories = this.imageCategories() || [];
    return categories.filter((category) => {
      const filtered = this.filteredImagesByCategory(category._id);
      return filtered && filtered.length > 0;
    });
  });

  ngOnInit(): void {
    this.listing.set(this.data.listing);
    this.fetchImageCategories();
  }

  fetchImageCategories() {
    this.isLoading.set(true);
    this.propertyImageCategoriesService
      .getPropertyImageCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
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
   * Opens the lightbox for a specific image (by index) within a given category.
   * @param index Index of the image within the *filtered* category images array
   * @param categoryId The ID of the image category
   */
  openLightbox(index: number, categoryId: string): void {
    // Filter the images for the selected category
    const images = this.filteredImagesByCategory(categoryId);
    if (images && images.length > 0 && index >= 0 && index < images.length) {
      this.lightboxCategoryImages.set(images);
      this.selectedCategoryId.set(categoryId);
      this.lightboxIndex.set(index);
      this.lightboxOpen.set(true);
    }
  }

  closeLightbox(): void {
    this.lightboxOpen.set(false);
    this.lightboxIndex.set(0);
    this.selectedCategoryId.set(null);
    this.lightboxCategoryImages.set(null);
  }

  /**
   * Navigate to previous image in the category lightbox.
   */
  previousImage(): void {
    const images = this.lightboxCategoryImages() ?? [];
    const currIndex = this.lightboxIndex();
    if (images.length > 0 && typeof currIndex === 'number') {
      const newIndex = currIndex > 0 ? currIndex - 1 : images.length - 1;
      this.lightboxIndex.set(newIndex);
    }
  }

  /**
   * Navigate to next image in the category lightbox.
   */
  nextImage(): void {
    const images = this.lightboxCategoryImages() ?? [];
    const currIndex = this.lightboxIndex();
    if (images.length > 0 && typeof currIndex === 'number') {
      const newIndex = currIndex < images.length - 1 ? currIndex + 1 : 0;
      this.lightboxIndex.set(newIndex);
    }
  }

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

  close() {
    this.dialogRef.close();
  }
}
