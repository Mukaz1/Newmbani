import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Booking,
  BookingStatusEnum,
  CreateBooking,
  HttpResponseInterface,
  PaginatedData,
} from '@newmbani/types';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http: HttpClient = inject(HttpClient);

  getBookings(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
    landlordId?: string;
    customerId?: string;
    propertyId?: string;
  }): Observable<HttpResponseInterface<PaginatedData<Booking[]>>> {
    let params = new HttpParams();
    if (data) {
      if (data.limit !== undefined)
        params = params.set('limit', data.limit.toString());
      if (data.page !== undefined)
        params = params.set('page', data.page.toString());
      if (data.keyword) params = params.set('keyword', data.keyword);
      if (data.customerId) params = params.set('customerId', data.customerId);
      if (data.propertyId) params = params.set('propertyId', data.propertyId);
      if (data.landlordId) params = params.set('landlordId', data.landlordId);
    }
    const options = { params };

    console.log(options);
    return this.http.get<HttpResponseInterface<PaginatedData<Booking[]>>>(
      API_ENDPOINTS.GET_BOOKINGS,
      options,
    );
  }

  getBookingById(id: string): Observable<HttpResponseInterface<Booking>> {
    const endpoint = API_ENDPOINTS.GET_BOOKING(id);
    return this.http.get<HttpResponseInterface<Booking>>(endpoint);
  }

  createBooking(
    booking: CreateBooking,
  ): Observable<HttpResponseInterface<CreateBooking>> {
    return this.http.post<HttpResponseInterface<CreateBooking>>(
      API_ENDPOINTS.CREATE_BOOKING,
      booking,
    );
  }

  updateBooking(
    id: string,
    booking: Partial<CreateBooking>,
  ): Observable<HttpResponseInterface<Booking>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_BOOKING(id)}`;
    return this.http.patch<HttpResponseInterface<Booking>>(endpoint, booking);
  }

  /**
   * Create a booking cancellation record (customer-initiated cancellation)
   */
  createCancellation(payload: {
    customerId: string;
    bookingId: string;
    reason: string;
  }): Observable<HttpResponseInterface<any>> {
    return this.http.post<HttpResponseInterface<any>>(
      (API_ENDPOINTS as any).CREATE_BOOKING_CANCELLATION,
      payload,
    );
  }

  updateBookingStatus(
    id: string,
    status: BookingStatusEnum,
  ): Observable<HttpResponseInterface<Booking>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_BOOKING_STATUS(id)}`;
    return this.http.patch<HttpResponseInterface<Booking>>(endpoint, {
      status,
    });
  }

  deleteBooking(id: string): Observable<HttpResponseInterface<void>> {
    const endpoint = `${API_ENDPOINTS.DELETE_BOOKING(id)}`;

    return this.http.delete<HttpResponseInterface<void>>(endpoint);
  }
}
