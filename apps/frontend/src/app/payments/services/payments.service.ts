import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_ENDPOINTS } from '../../common/routes.constants';
import {
  CreatePaymentAllocation,
  HttpResponseInterface,
  PaginatedData,
  Payment,
  PaymentAllocation,
  SOCKET_NAMESPACES,
  SocketIoEnums,
} from '@newmbani/types';
import { Observable } from 'rxjs';
import { SocketService } from '../../socket.io/socket-io.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService extends SocketService {
  private httpClient = inject(HttpClient);

  searchPayments(payload: {
    customerId?: string;
    invoiceId?: string;
    page: number;
    limit: number;
    keyword: string;
  }) {
    this.getSocket(SOCKET_NAMESPACES.PAYMENTS).emit(
      SocketIoEnums.paymentsSearch,
      payload
    );
  }

  listenForPaymentUpdates(): Observable<
    HttpResponseInterface<PaginatedData<Payment[] | null>>
  > {
    const socket = this.getSocket(SOCKET_NAMESPACES.PAYMENTS);
    return new Observable((observer) => {
      socket.on(SocketIoEnums.paymentsSearch, (data) => {
        observer.next(data);
      });
      return () => socket.off(SocketIoEnums.paymentsSearch);
    });
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
  }): Observable<HttpResponseInterface<PaginatedData<Payment[] | null>>> {
    const endpoint = API_ENDPOINTS.VIEW_PAYMENTS;
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
      HttpResponseInterface<PaginatedData<Payment[] | null>>
    >(endpoint, options);
  }

  findOne(id: string): Observable<HttpResponseInterface<Payment>> {
    const endpoint = `${API_ENDPOINTS.VIEW_PAYMENT}/${id}`;
    return this.httpClient.get<HttpResponseInterface<Payment>>(endpoint);
  }

  sendStkPush(data: {
    invoiceId: string;
    phoneNumber: string;
  }): Observable<HttpResponseInterface> {
    const { invoiceId, phoneNumber } = data;
    const endpoint = `${API_ENDPOINTS.VIEW_PAYMENT}/mpesa/${invoiceId}`;
    return this.httpClient.post<HttpResponseInterface>(endpoint, {
      phoneNumber,
    });
  }


  createPaymentAllocation(
    payload: Omit<CreatePaymentAllocation, 'serial'>
  ): Observable<HttpResponseInterface<PaymentAllocation | null>> {
    return this.httpClient.post<
      HttpResponseInterface<PaymentAllocation | null>
    >(API_ENDPOINTS.CREATE_PAYMENT_ALLOCATION, payload);
  }

  getPaymentAllocationItems(
    data?:{
    paymentId?: string,
    limit:number
  }): Observable<HttpResponseInterface<PaginatedData<PaymentAllocation[]> | null>> {
    const params = new HttpParams({fromObject:data});
    return this.httpClient.get<HttpResponseInterface<PaginatedData<PaymentAllocation[]> | null>
    >(API_ENDPOINTS.VIEW_PAYMENT_ALLOCATIONS, { params });
  }
}