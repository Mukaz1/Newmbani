import { Injectable, inject } from '@angular/core';
// import { API_ENDPOINTS } from '../../common/routes.constants'; // No longer used for landlord endpoints
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseInterceptor } from '../../common/interceptors/http-response.interceptor';
import {
  HttpResponseInterface,
  RegisterCustomer,
  CreateLandlord,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

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
    const endpoint = API_ENDPOINTS.CREATE_LANDLORD;
    return this.httpClient.post<HttpResponseInterceptor>(
      endpoint,
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
    // This endpoint assignment remains unchanged
    return this.httpClient.post<HttpResponseInterface>(
      API_ENDPOINTS.CUSTOMER_ONBOARDING,
      payload
    );
  }
}
