import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ManageAddress } from './modals/manage-address/manage-address';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from '../../../common/components/button/button';
import { Address, NotificationStatusEnum } from '@newmbani/types';
import { AddressesService } from '../../../addresses/services/addresses.service';
import { NotificationService } from '../../../common/services/notification.service';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'app-addresses',
  imports: [Button],
  templateUrl: './addresses.html',
  styleUrl: './addresses.scss',
})
export class Addresses implements OnInit {
  addresses = signal<Address[]>([]);
  showEmptyState = computed(() => this.addresses().length === 0);
  isLoadingAddresses = signal(false);

  private shippingAddressesService = inject(AddressesService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Addresses',
            isClickable: false,
          },
        ],
      },
      title: 'Addresses',
      description: 'All Addresses',
    });
  }
  ngOnInit() {
    this.loadAddresses();
  }

  private loadAddresses() {
    this.isLoadingAddresses.set(true);
    this.shippingAddressesService.all().subscribe({
      next: (response: any) => {
        if (response.data && response.data.data) {
          this.addresses.set(response.data.data);
        }
        this.isLoadingAddresses.set(false);
      },
      error: (error) => {
        this.isLoadingAddresses.set(false);
      },
    });
  }

  addAddress() {
    const modalRef = this.dialog.open(ManageAddress, {
      disableClose: true,
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        const address = result as Address;
        if (!address) return;
        this.addresses.set([...this.addresses(), address]);
      });
  }

  editAddress(address: Address) {
    const modalRef = this.dialog.open(ManageAddress, {
      disableClose: true,
      data: {
        address,
      },
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        const address = result as Address;
        if (!address) return;
        this.addresses.set([
          ...this.addresses().filter(
            (_address) => _address._id.toString() !== address._id.toString()
          ),
          address,
        ]);
      });
  }

  deleteAddress(addressId: string) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message:
          'Are you sure you want to delete this address? This action cannot be undone.',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors',
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed as boolean) {
          this.shippingAddressesService
            .delete(addressId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.notificationService.notify({
                  title: 'Address Deleted',
                  message: 'The address has been successfully removed.',
                  status: NotificationStatusEnum.SUCCESS,
                });

                // Reload the updated address list
                this.loadAddresses();
              },
              error: (error) => {
                console.error('Error deleting address:', error);
                this.notificationService.notify({
                  title: 'Deletion Failed',
                  message:
                    error.error?.message ||
                    'Unable to delete the address. Please try again later.',
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        }
      });
  }

  getAddressTypeIcon(address: Address): string {
    // Determine icon based on address name or other criteria
    const name = address.name.toLowerCase();
    if (name.includes('home') || name.includes('house')) {
      return 'bi-house';
    } else if (name.includes('work') || name.includes('office')) {
      return 'bi-building';
    } else {
      return 'bi-geo-alt';
    }
  }

  getAddressTypeColor(address: Address): string {
    const name = address.name.toLowerCase();
    if (name.includes('home') || name.includes('house')) {
      return 'text-green-600';
    } else if (name.includes('work') || name.includes('office')) {
      return 'text-blue-600';
    } else {
      return 'text-purple-600';
    }
  }
}
