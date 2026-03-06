import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../common/routes.constants';
import {
  CreateBankTransferPayment,
  HttpResponseInterface,
  BankTransferPayment,
  PaginatedData,
  Payment,
} from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BankTransferPaymentsService {
  private httpClient = inject(HttpClient);

  create(
    paymentData: CreateBankTransferPayment
  ): Observable<HttpResponseInterface<Payment>> {
    const endpoint = API_ENDPOINTS.CREATE_BANK_TRANSFER_PAYMENT;
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
  }): Observable<
    HttpResponseInterface<PaginatedData<BankTransferPayment[] | null>>
  > {
    const endpoint = API_ENDPOINTS.VIEW_BANK_TRANSFER_PAYMENTS;
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
      HttpResponseInterface<PaginatedData<BankTransferPayment[] | null>>
    >(endpoint, options);
  }

  findOne(id: string): Observable<HttpResponseInterface<BankTransferPayment>> {
    const endpoint = `${API_ENDPOINTS.VIEW_BANK_TRANSFER_PAYMENT}/${id}`;
    return this.httpClient.get<HttpResponseInterface<BankTransferPayment>>(
      endpoint
    );
  }
}
