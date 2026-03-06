import { Component, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { UsersService } from '../../../admin/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodeEnum, NotificationStatusEnum } from '@newmbani/types';
import { RegisterCustomer, HttpResponseInterface } from '@newmbani/types';
import { Button } from '../../../common/components/button/button';
import { passwordValidator } from '../../../common/utils/passwordValidator.util';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.html',
  styleUrls: ['./create-customer.scss'],
  imports: [FormsModule, ReactiveFormsModule, Button],
})
export class CreateCustomer implements OnDestroy {
  customer: RegisterCustomer[] = [];
  isLoading = false;

  registerNewCustomer: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
  });
  destroy$ = new Subject();
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly notificationsService = inject(NotificationService);
  private readonly metaService = inject(MetaService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

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
            linkTitle: 'New Customer',
            isClickable: false,
          },
        ],
      },
      title: 'New Customer',
      description: 'New Customer',
    });
  }

  createNewCustomer(): void {
    this.isLoading = true;
    if (this.registerNewCustomer.valid) {
      const { name, email, password, phone, countryId, acceptTerms } =
        this.registerNewCustomer.value;

      const new_customer: RegisterCustomer = {
        name,
        email,
        password,
        phone,
        countryId,
        acceptTerms,
      };

      this.usersService
        .addNewCustomer(new_customer)
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
            if (response.statusCode === HttpStatusCodeEnum.FOUND) {
              this.notificationsService.notify({
                title: 'Warning!',
                message: response.message,
                status: NotificationStatusEnum.WARNING,
              });
              return;
            }
            if (response.statusCode === HttpStatusCodeEnum.BAD_REQUEST) {
              this.notificationsService.notify({
                title: 'Warning!',
                message: response.message,
                status: NotificationStatusEnum.WARNING,
              });
              return;
            }

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message,
              status: NotificationStatusEnum.SUCCESS,
            });
            this.router.navigateByUrl(`/admin/customers/${response.data._id}`);
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
      this.notificationsService.notify({
        title: 'Error!',
        message: 'Check your customer registration form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }
  discard() {
    this.registerNewCustomer.reset();
  }

  // Go back to customer list
  goToCustomerList(): void {
    this.router.navigateByUrl('/admin/customers');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
