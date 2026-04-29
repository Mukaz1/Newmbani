import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  CurrencyPipe,
  DatePipe,
  isPlatformBrowser,
  TitleCasePipe,
} from '@angular/common';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import {
  HttpResponseInterface,
  Property,
  NotificationStatusEnum,
  PropertyImageCategory,
  PropertyImage,
  PaginatedData,
  PropertyApprovalStatus,
} from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../auth/services/auth.service';
import { PropertyImagesService } from '../../../admin/pages/image-categories/services/property-image.service';
import { PropertyVerificationModal } from '../../modals/property-verification-modal/property-verification-modal';
import { ChangeImageCategory } from '../../modals/change-image-category/change-image-category';
import { PropertiesService } from '../../services/properties.service';
import { UploadImages } from '../../modals/upload-images/upload-images';
import { PropertyLocation } from '../../../marketplace/pages/properties/property-location/property-location';
import { FormatLabelPipe } from '../../../common/pipes/format-label.pipe';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { QrCodeModal } from '../../modals/qrCode-modal/qrCode-modal';

type TabType = 'details' | 'images';

@Component({
  selector: 'app-view-property',
  standalone: true,
  imports: [
    DataLoading,
    DatePipe,
    TitleCasePipe,
    CurrencyPipe,
    FormatLabelPipe,
    PropertyLocation,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  templateUrl: './view-property.html',
  styleUrl: './view-property.scss',
})
export class ViewProperty implements OnInit, OnDestroy {
  private readonly propertiesService = inject(PropertiesService);
  private readonly metaService = inject(MetaService);
  private readonly notificationService = inject(NotificationService);
  private readonly propertyImagesService = inject(PropertyImagesService);
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);

  // ── State signals ─────────────────────────────────────────────
  propertyId = signal<string | null>(null);
  property = signal<Property | null>(null);
  imageCategories = signal<PropertyImageCategory[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Tabs
  activeTab = signal<TabType>('details');

  // Actions dropdown
  actionsMenuOpen = signal(false);

  // Image viewer
  imageViewerOpen = signal(false);
  viewerImages = signal<PropertyImage[]>([]);
  viewerIndex = signal(0);

  // All images flat (for hero grid)
  allImages = computed(() => this.property()?.images ?? []);

  destroy$ = new Subject<void>();
  PropertyApprovalStatus = PropertyApprovalStatus;

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [{ linkTitle: 'Property Details', isClickable: false }],
      },
      title: 'Property Details',
      description: 'Property Details',
    });
  }

  ngOnInit(): void {
    this.propertyId.set(this.route.snapshot.paramMap.get('id'));
    const id = this.propertyId();
    if (id) this.getProperty(id);
    this.fetchImageCategories();

    // Close actions menu when clicking outside
    if (this.isBrowser) {
      document.addEventListener('click', () => {
        if (this.actionsMenuOpen()) this.actionsMenuOpen.set(false);
      });
    }
  }

  // ── Loaders ──────────────────────────────────────────────────

  getProperty(propertyId: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.propertiesService
      .getPropertyByIdOrSlug(propertyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponseInterface<Property>) => {
          if (response?.data) {
            this.property.set(response.data);
          } else {
            this.error.set('Failed to load property data');
          }
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.error.set(
            error.error?.message || error.message || 'Failed to load property',
          );
        },
      });
  }

  fetchImageCategories(): void {
    this.propertyImagesService
      .getPropertyImageCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (
          res: HttpResponseInterface<PaginatedData<PropertyImageCategory[]>>,
        ) => {
          this.imageCategories.set(res.data.data);
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify({
            title: 'Error',
            message: error.error?.message || 'Failed to load image categories',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  // ── Auth helpers ──────────────────────────────────────────────

  isAdmin(): boolean {
    return this.authService.getUserType().admin;
  }
  isLandlord(): boolean {
    return this.authService.getUserType().landlord;
  }

  // ── Tabs ──────────────────────────────────────────────────────

  switchTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  // ── Actions dropdown ──────────────────────────────────────────

  toggleActionsMenu(): void {
    this.actionsMenuOpen.set(!this.actionsMenuOpen());
  }

  // ── Navigation ────────────────────────────────────────────────

  goBack(): void {
    if (this.isAdmin()) {
      this.router.navigate(['/admin/properties']);
    } else {
      this.router.navigate(['/landlord/properties']);
    }
  }

  editProperty(id: string): void {
    this.router.navigate([`/landlord/properties/${id}/edit`]);
  }

  // ── Status badge ──────────────────────────────────────────────

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

  // ── Image helpers ─────────────────────────────────────────────

  filteredImagesByCategory(categoryId: string): PropertyImage[] {
    return (this.property()?.images ?? []).filter(
      (img) => img.propertyImageCategoryId === categoryId,
    );
  }

  // ── Image viewer ──────────────────────────────────────────────

  openImageViewer(index: number, images: PropertyImage[]): void {
    if (!images.length) return;
    this.viewerImages.set(images);
    this.viewerIndex.set(Math.max(0, Math.min(index, images.length - 1)));
    this.imageViewerOpen.set(true);
  }

  closeImageViewer(): void {
    this.imageViewerOpen.set(false);
  }

  viewerPrev(): void {
    const len = this.viewerImages().length;
    if (!len) return;
    const i = this.viewerIndex();
    this.viewerIndex.set(i > 0 ? i - 1 : len - 1);
  }

  viewerNext(): void {
    const len = this.viewerImages().length;
    if (!len) return;
    const i = this.viewerIndex();
    this.viewerIndex.set(i < len - 1 ? i + 1 : 0);
  }

  onViewerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closeImageViewer();
        break;
      case 'ArrowLeft':
        this.viewerPrev();
        break;
      case 'ArrowRight':
        this.viewerNext();
        break;
    }
  }

  // ── Upload images (landlord only) ─────────────────────────────

  uploadImagesModal(categoryId: string): void {
    const propertyId = this.property()?._id?.toString();
    if (!propertyId || !categoryId) return;

    const ref = this.dialog.open(UploadImages, {
      disableClose: true,
      data: { propertyId, propertyImageCategoryId: categoryId },
    });

    ref.closed.subscribe((result: unknown) => {
      if (result) this.getProperty(propertyId);
    });
  }

  // ── Remove image ──────────────────────────────────────────────

  removeImage(propertyImageId: string | null): void {
    if (!propertyImageId) return;

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Image',
        message:
          'Are you sure you want to delete this image? This cannot be undone.',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors',
      },
    });

    ref.closed.pipe(takeUntil(this.destroy$)).subscribe((confirmed) => {
      if (!confirmed) return;
      this.propertiesService
        .removePropertyImage(propertyImageId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.notify({
              title: 'Deleted',
              message: 'Image deleted successfully',
              status: NotificationStatusEnum.SUCCESS,
            });
            const id = this.propertyId();
            if (id) this.getProperty(id);
            this.closeImageViewer();
          },
          error: (err: HttpErrorResponse) => {
            this.notificationService.notify({
              title: 'Error',
              message: err.error?.message || 'Failed to delete image',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    });
  }

  /** Called from the image viewer action bar */
  removeImageFromViewer(imageId: string): void {
    this.removeImage(imageId);
  }

  // ── Change image category ─────────────────────────────────────

  changePropertyImageCategory(propertyImage: PropertyImage): void {
    const ref = this.dialog.open(ChangeImageCategory, {
      data: { propertyImage, propertyName: this.property()!.title },
    });

    ref.closed.subscribe((result: unknown) => {
      const updated = result as PropertyImage;
      if (updated?.propertyId) {
        this.getProperty(updated.propertyId);
        this.closeImageViewer();
      }
    });
  }

  // ── Approve property (admin only) ─────────────────────────────

  approveProperty(property: Property): void {
    const ref = this.dialog.open(PropertyVerificationModal, {
      data: { property },
    });

    ref.closed.subscribe(() => {
      const id = this.property()?._id;
      if (id) this.getProperty(id);
    });
  }

  openQrModal(property: Property, mode: 'generate' | 'view'): void {
    const ref = this.dialog.open(QrCodeModal, {
      data: { property, mode },
      disableClose: true,
    });

    ref.closed.subscribe((updated) => {
      if (updated as boolean) {
        const id = this.propertyId();
        if (id) this.getProperty(id); // refresh to get QR
      }
    });
  }

  // ── Delete property ───────────────────────────────────────────

  deleteProperty(property?: Property | null): void {
    if (!property) return;

    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Property',
        message: `Are you sure you want to delete "${property.title}"? This cannot be undone.`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors',
      },
    });

    ref.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) return;
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
              this.goBack();
            },
            error: (err: HttpErrorResponse) => {
              this.notificationService.notify({
                title: 'Error',
                message: err.error?.message || err.message,
                status: NotificationStatusEnum.ERROR,
              });
            },
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
