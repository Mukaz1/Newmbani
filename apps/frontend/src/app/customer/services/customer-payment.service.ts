import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponseInterface, PaginatedData, Payment } from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerPaymentService {
  http = inject(HttpClient);

  fetchCustomerPayments(): Observable<
    HttpResponseInterface<PaginatedData<Payment[]>>
  > {
    return this.http.get<HttpResponseInterface<PaginatedData<Payment[]>>>('');
  }
}
