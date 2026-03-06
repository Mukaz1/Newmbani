import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../common/routes.constants';
import {
  CreateChequePayment,
  HttpResponseInterface,
  ChequePayment,
  PaginatedData,
  Payment,
} from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChequePaymentsService {
  private httpClient = inject(HttpClient);

  create(
    paymentData: CreateChequePayment
  ): Observable<HttpResponseInterface<Payment>> {
    const endpoint = API_ENDPOINTS.CREATE_CHEQUE_PAYMENT;
    return this.httpClient.post<HttpResponseInterface<Payment>>(
      endpoint,
      paymentData
    );
  }

  /**
   * Get manual Mpesa payments with optional filters.
   *
   * @param payload Optional parameters for filtering the payments.
   * @returns An observable containing the paginated data of manual Mpesa payments.
   */
  findAll(payload?: {
    customerId?: string;
    invoiceId?: string;
    page: number;
    limit: number;
    keyword: string;
  }): Observable<HttpResponseInterface<PaginatedData<ChequePayment[] | null>>> {
    const endpoint = API_ENDPOINTS.VIEW_CHEQUE_PAYMENTS;
    const options = payload
      ? {
          params: new HttpParams()
            .set('limit', payload.limit)
            .set('page', payload.page)
            .set('invoiceId', payload.invoiceId ?? '')
            .set('customerId', payload.customerId ?? '')
            .set('keyword', payload.keyword ?? ''),
        }
      : {};
    return this.httpClient.get<
      HttpResponseInterface<PaginatedData<ChequePayment[] | null>>
    >(endpoint, options);
  }

  findOne(id: string): Observable<HttpResponseInterface<ChequePayment>> {
    const endpoint = `${API_ENDPOINTS.VIEW_CHEQUE_PAYMENT}/${id}`;
    return this.httpClient.get<HttpResponseInterface<ChequePayment>>(endpoint);
  }
}
