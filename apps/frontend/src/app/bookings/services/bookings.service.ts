import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Booking, CreateBooking, HttpResponseInterface, PaginatedData } from '@newmbani/types';
import { API_ENDPOINTS } from '@newmbani/shared';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient)

  getBookings(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
  }): Observable<HttpResponseInterface<PaginatedData<Booking[]>>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit?.toString() ?? '')
            .set('page', data.page?.toString() ?? '')
            .set('keyword', data.keyword ?? ''),
        }
      : {};
    return this.http.get<
      HttpResponseInterface<PaginatedData<Booking[]>>
    >(API_ENDPOINTS.GET_BOOKINGS, options);
  }

  getBookingById(
    id: string
  ): Observable<HttpResponseInterface<Booking>> {
    const endpoint  = API_ENDPOINTS.GET_BOOKING(id)
    return this.http.get<HttpResponseInterface<Booking>>(
     endpoint
    );
  }

  createBooking(
    booking: CreateBooking
  ): Observable<HttpResponseInterface<CreateBooking>> {
    return this.http.post<HttpResponseInterface<CreateBooking>>(
      API_ENDPOINTS.CREATE_BOOKING,
      booking
    );
  }

  updateBooking(
    id: string,
    booking: Partial<CreateBooking>
  ): Observable<HttpResponseInterface<Booking>> {
    const endpoint =API_ENDPOINTS.UPDATE_BOOKING(id)
    return this.http.patch<HttpResponseInterface<Booking>>(
      booking
    );
  }

  deleteBooking(id: string): Observable<HttpResponseInterface<void>> {
    const endpoint =API_ENDPOINTS.DELETE_BOOKING(id)

    return this.http.delete<HttpResponseInterface<void>>(
      endpoint
    );
  }

}
