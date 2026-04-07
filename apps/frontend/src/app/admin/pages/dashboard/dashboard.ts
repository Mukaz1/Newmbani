import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TopCategories } from '../../widgets/top-categories/top-categories';
import { WelcomeCard } from '../../widgets/welcome-card/welcome-card';
import { TopStats } from '../../widgets/top-stats/top-stats';
import { TopSellingProperties } from '../../widgets/top-selling-properties/top-selling-properties';
import { TopLandlords } from '../../widgets/top-landlords/top-landlords';
import { LandlordsService } from '../../../landlords/services/landlords.service';
import { PropertiesService } from '../../../properties/services/properties.service';
import { BookingsService } from '../../../bookings/services/bookings.service';
import { Booking, HttpResponseInterface, Landlord, PaginatedData, Property } from '@newmbani/types';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [
    TopCategories,
    TopSellingProperties,
    WelcomeCard,
    TopLandlords,
    TopStats,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard implements OnInit {
  totalClients = signal(0);
  totalBookings = signal(0);
  totalProperties = signal(0);
  highestProperty = signal(0);
  isLoading = signal(false)

  private landlordsService = inject(LandlordsService)
  private propertiesService = inject(PropertiesService)
  private bookingsService = inject(BookingsService)
  private destroyRef = inject(DestroyRef)

  setTotalClients(clients: number) {
    this.totalClients.set(clients);
  }
  setTotalBookings(bookings: number) {
    this.totalBookings.set(bookings);
  }

  ngOnInit(): void {
    this.fetchBookings()
    this.fetchLandlords()
    this.fetchProperties()
  }

  fetchBookings() {
    this.isLoading.set(true);
    this.bookingsService
      .getBookings({
        limit: -1,
        page: 1,
        keyword: '',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res:HttpResponseInterface<PaginatedData<Booking[]>>) => {
        const bookings = res.data.data
        this.totalBookings.set(bookings.length)
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(err)

        },
      });
  }

  fetchLandlords() {
    this.isLoading.set(true);
    this.landlordsService
      .getAllLandlords({
        limit: -1,
        page: 1,
        keyword: '',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.isLoading.set(false)
          const data =
            (res as HttpResponseInterface<PaginatedData<Landlord[]>>)?.data
              ?.data || [];
          this.totalClients.set(res?.data?.total || data.length || 0);

        },
        error: (err) => {
          console.error(err)
          this.isLoading.set(false);
        },
      });
  }

  fetchProperties() {
    this.isLoading.set(true);
    this.propertiesService
      .getAllProperties({
        limit: -1,
        page: 1,
        keyword: '',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          const res = response as HttpResponseInterface<PaginatedData<Property[]>>;
          const properties = res.data.data || [];
          this.totalProperties.set(properties.length || 0);

          // Find the property with the highest rentPrice
          let highestProperty = null;
          if (properties.length > 0) {
            highestProperty = properties.reduce((max, property) => {
              return (property.rentPrice ?? 0) > (max.rentPrice ?? 0) ? property : max;
            }, properties[0]);
          }
          // Store the highest property's rent price, or 0 if none exist
          this.highestProperty.set(highestProperty?.rentPrice ?? 0);

          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          console.error(error)
        },
      });
  }
}
