import { UsersService } from '../../../admin/services/users.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodeEnum, NotificationStatusEnum } from '@newmbani/types';
import { Customer, HttpResponseInterface, UpdateCustomer } from '@newmbani/types';
import { Button } from '../../../common/components/button/button';
import { DataLoading } from '../../../common/components/data-loading/data-loading';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.html',
  styleUrls: ['./edit-customer.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    Button,
  ],
})
export class EditCustomer implements OnInit, OnDestroy {
  customerId: string | null = null;
  customer: Customer | null = null;

  isLoading = false;
  editCustomerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
  });
  destroy$ = new Subject();

  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Customers',
            isClickable: true,
            link: '/admin/customers',
          },
          {
            linkTitle: 'Update Customer',
            isClickable: false,
          },
        ],
      },
      title: 'Update Customer',
      description: 'Update Customer',
    });
  }

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');

    if (this.customerId) {
      this.usersService
        .getCustomerById(this.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface) => {
            const customer: Customer = res.data;
            this.customer = customer;
            this.changeDetectorRef.detectChanges();
            this.patchForm();
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          },
        });
    }
  }

  patchForm() {
    if (this.customer) {
      this.editCustomerForm.patchValue({
        name: this.customer.name,
        email: this.customer.email,
        phone: this.customer.phone,
      });
    }
  }

  discard() {
    if (this.customer) {
      this.editCustomerForm.patchValue({
        name: this.customer.name,
        email: this.customer.email,
        phone: this.customer.phone,
      });
    }
  }
  goToCustomerList(): void {
    this.router.navigateByUrl('/admin/customers');
  }
  editCustomer(): void {
    this.isLoading = true;
    if (this.editCustomerForm.valid && this.customerId) {
      const { name, phone } = this.editCustomerForm.value;

      const customer: UpdateCustomer = {
        name,
        phone,
      };

      this.usersService
        .editCustomer(this.customerId, customer)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: HttpResponseInterface) => {
            this.isLoading = false;
            if (response.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
              this.notificationsService.notify({
                title: 'Error!',
                message: response.message,
                status: NotificationStatusEnum.ERROR,
              });
              return;
            }

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message,
              status: NotificationStatusEnum.SUCCESS,
            });

            this.router.navigate(['/admin/customers/', this.customerId]);
            return;
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            this.notificationsService.notify({
              title: 'Error!',
              message: error.message,
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      this.isLoading = false;
      this.notificationsService.notify({
        title: 'Error!',
        message: 'Check your customer update form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
