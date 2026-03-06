import { UsersService } from '../../../admin/services/users.service';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer, HttpResponseInterface } from '@newmbani/types';
import { MetaService } from '../../../common/services/meta.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { InitialsPipe } from '../../../common/pipes/initials.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.html',
  styleUrls: ['./view-customer.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    RouterLink,
    InitialsPipe,
    DatePipe,
  ],
})
export class ViewCustomer implements OnInit, OnDestroy {
  customerId: string | null = null;
  customer: Customer | null = null;
  isLoading = true;
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly metaService = inject(MetaService);
  private router = inject(Router);
  destroy$ = new Subject();

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id');
    if (this.customerId) {
      this.usersService
        .getCustomerById(this.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface) => {
            this.customer = res.data;

            this.changeDetectorRef.detectChanges();
            this.metaService.setMeta({
              breadcrumb: {
                links: [
                  {
                    linkTitle: 'Customers',
                    isClickable: true,
                    link: '/admin/customers',
                  },
                  {
                    linkTitle: 'Customer Profile',
                    isClickable: false,
                  },
                ],
              },
              title: `${this.customer?.name}'s Profile`,
              description: 'Customer Profile',
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
          },
        });
    }
  }

  getIcon(): string | null {
    return `/assets/media/avatar.webp`;
  }
  goToCustomerList(): void {
    this.router.navigateByUrl('/admin/customers');
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
