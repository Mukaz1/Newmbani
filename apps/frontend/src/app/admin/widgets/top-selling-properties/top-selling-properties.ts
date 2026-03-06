import { Component, inject, OnInit, signal } from '@angular/core';
import { PaginatedData, PropertyListing } from '@newmbani/types';
import { PropertyListingService } from '../../../property-listing/services/property-listing.service';
import { take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { PricePipe } from '../../../common/pipes/price.pipe';

@Component({
  selector: 'app-top-selling-properties',
  imports: [PricePipe],
  templateUrl: './top-selling-properties.html',
  styleUrl: './top-selling-properties.scss',
})
export class TopSellingProperties implements OnInit {
  propertyListings = signal<PropertyListing[] | []>([]);
  isLoading = signal(true);
  paginatedData = signal<PaginatedData<any> | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  private readonly propertyListingService = inject(PropertyListingService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.getPropertyListings();
  }

  getPropertyListings() {
    this.isLoading.set(true);
    this.propertyListingService
      .getAllPropertyListings({
        keyword: this.keyword(),
        limit: this.pageSize(),
        page: this.currentPage(),
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.paginatedData.set(res.data);
          this.propertyListings.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        },
      });
  }
}
