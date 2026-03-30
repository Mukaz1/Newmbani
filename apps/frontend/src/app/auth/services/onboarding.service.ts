import { Injectable, inject } from '@angular/core';
import { API_ENDPOINTS } from '../../common/routes.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseInterceptor } from '../../common/interceptors/http-response.interceptor';
import {
  HttpResponseInterface,
  RegisterCustomer,
  CreateLandlord,
} from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
   private httpClient: HttpClient = inject(HttpClient);

  /**
   * Register a landlord with the API.
   *
   * @param payload The payload required by the API to register a landlord.
   * @returns The response from the API or an error if the request fails.
   */
  registerLandlord(payload: CreateLandlord): Observable<HttpResponseInterceptor> {
    return this.httpClient.post<HttpResponseInterceptor>(
      API_ENDPOINTS.LANDLORD_ONBOARDING,
      payload
    );
  }

  /**
   * Register a customer with the API.
   *
   * @param payload The payload required by the API to register a customer.
   * @returns The response from the API or an error if the request fails.
   */
  registerCustomer(
    payload: RegisterCustomer
  ): Observable<HttpResponseInterface> {
    return this.httpClient.post<HttpResponseInterface>(
      API_ENDPOINTS.CUSTOMER_ONBOARDING,
      payload
    );
  }
}
