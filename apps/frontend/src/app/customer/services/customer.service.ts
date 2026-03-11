import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Customer,
  HttpResponseInterface,
  PaginatedData,
  CreateCustomer,
  SOCKET_NAMESPACES,
  UpdateCustomer,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';
import { Observable } from 'rxjs';
import { SocketService } from '../../socket.io/socket-io.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService extends SocketService {
  private readonly httpClient = inject(HttpClient);

  searchCustomer(keyword: string) {
    this.getSocket(SOCKET_NAMESPACES.CUSTOMERS).emit('customerSearch', { keyword, limit: -1, slim: true });
  }

  /**
   * Create a new customer
   */
  createCustomer(
    payload: CreateCustomer
  ): Observable<HttpResponseInterface<Customer>> {
    const endpoint = `${API_ENDPOINTS.CREATE_CUSTOMER}`;
    return this.httpClient.post<HttpResponseInterface<Customer>>(
      endpoint,
      payload
    );
  }

  /**
   * Get all customers with pagination and search
   */
  getCustomers(data: {
    limit: number;
    page: number;
    keyword: string;
    slim: boolean;
  }): Observable<HttpResponseInterface<PaginatedData<Customer[]>>> {
    const endpoint = `${API_ENDPOINTS.ALL_CUSTOMERS}`;
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('slim', data.slim ?? false)
            .set('keyword', data.keyword ?? ''),
        }
      : {};
    return this.httpClient.get<
      HttpResponseInterface<PaginatedData<Customer[]>>
    >(endpoint, options);
  }

  /**
   * Get customer by ID
   */
  getCustomerById(id: string): Observable<HttpResponseInterface<Customer>> {
    const endpoint = `${API_ENDPOINTS.VIEW_CUSTOMER}/${id}`;
    return this.httpClient.get<HttpResponseInterface<Customer>>(endpoint);
  }

  /**
   * Get customer by phone number
   */
  getCustomerByPhone(
    phone: string
  ): Observable<HttpResponseInterface<Customer>> {
    const endpoint = `${API_ENDPOINTS.VIEW_CUSTOMER}/phone/${phone}`;
    return this.httpClient.get<HttpResponseInterface<Customer>>(endpoint);
  }

  /**
   * Update customer
   */
  updateCustomer(
    id: string,
    payload: UpdateCustomer
  ): Observable<HttpResponseInterface<Customer>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_CUSTOMER}/${id}`;
    return this.httpClient.patch<HttpResponseInterface<Customer>>(
      endpoint,
      payload
    );
  }

  /**
   * Delete customer
   */
  deleteCustomer(id: string): Observable<HttpResponseInterface<null>> {
    const endpoint = `${API_ENDPOINTS.DELETE_CUSTOMER}/${id}`;
    return this.httpClient.delete<HttpResponseInterface<null>>(endpoint);
  }
}
