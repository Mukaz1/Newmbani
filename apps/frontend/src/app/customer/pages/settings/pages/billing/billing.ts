import {
  User,
  Customer,
  Country,
  HttpResponseInterface,
  NotificationStatusEnum,
  Address,
} from '@newmbani/types';
import { Dialog } from '@angular/cdk/dialog';
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
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../../auth/services/auth.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { MediaService } from '../../../../../files/services/media.service';
import { CustomersService } from '../../../../services/customer.service';
import { ManageAddress } from '../../../../components/addresses/modals/manage-address/manage-address';
import { SearchableSelectOption } from '../../../../../marketplace/components/searchable-select/searchable-select';

@Component({
  selector: 'app-billing',
  imports: [],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing implements OnInit {
  private destroyRef = inject(DestroyRef);
  private customersService = inject(CustomersService);
  private authService = inject(AuthService);
  private notificationsService = inject(NotificationService);
  private dialog = inject(Dialog);
  private mediaService = inject(MediaService);

  user = signal<User | undefined>(undefined);
  billingAddress = signal<Address | null>(null);
  customer = signal<Customer | undefined>(undefined);
  countries = signal<Country[]>([]);
  loading = signal(false);
  editMode = signal(false);
  selectedImageFile: File | null = null;
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country.name,
        description: country.code,
      })
    )
  );

  profileForm!: FormGroup;

  ngOnInit() {
    const user = this.authService.getStoredUser();
    this.user.set(user ?? undefined);
    if (user?.customerId) this.fetchCustomer(user.customerId);
  }

  fetchCustomer(id: string) {
    this.loading.set(true);
    this.customersService
      .getCustomerById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponseInterface<Customer>) => {
          this.loading.set(false);
          const customer = res.data;
          this.customer.set(customer);
          this.billingAddress.set(this.customer()?.billingAddress ?? null);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationsService.notify({
            title: 'Error',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  addAddress() {
    const modalRef = this.dialog.open(ManageAddress);
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result) {
          const billingAddress = result as Address;
          this.billingAddress.set(billingAddress);
        }
      });
  }

  editAddress(billingAddress: Address) {
    const modalRef = this.dialog.open(ManageAddress, {
      disableClose: true,
      data: {
        billingAddress,
      },
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: any) => {
        const billingAddress = result as Address;
        if (!billingAddress) return;
        this.billingAddress.set(billingAddress);
      });
  }
}
