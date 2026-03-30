import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../common/routes.constants';
import { HttpResponseInterface, Invoice, PaginatedData } from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerInvoiceService {
  http: HttpClient = inject(HttpClient);

  // getClientInvoices(
  //   customerId: string
  // ): Observable<HttpResponseInterface<PaginatedData<Invoice[]>>> {
  //   const params = new HttpParams().set('customerId', customerId);
  //   return this.http.get<HttpResponseInterface<PaginatedData<Invoice[]>>>(
  //     API_ENDPOINTS.GET_INVOICES,
  //     { params }
  //   );
  // }
}
