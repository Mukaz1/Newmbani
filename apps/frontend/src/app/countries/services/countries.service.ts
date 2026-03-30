import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';
import {
  Country,
  HttpResponseInterface,
  PaginatedData,
  UpdateCountry,
} from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
   private http: HttpClient = inject(HttpClient);

  // Signals to hold the loaded countries

  allCountries = signal<Country[]>([]);

  supportedCountries = computed(() =>
    this.allCountries().filter((country) => country.supported)
  );

  notSupportedCountries = computed(() =>
    this.allCountries().filter((country) => !country.supported)
  );
  readonly countries = signal<Country[]>([]);

  customerSupportedCountries = computed(() =>
    this.supportedCountries().filter((country) => country.supporting.customer)
  );
  hostSupportedCountries = signal<Country[]>([]);

  countriesLoaded = signal<boolean>(false);

  /**
   * Fetch countries with pagination and search - returns Observable for component use
   */
  getCountries(params?: {
    supported?: 'true' | 'false';
    supportingHost?: 'true' | 'false';
    supportingCustomer?: 'true' | 'false';
    page?: number;
    limit?: number;
    keyword?: string;
  }): Observable<HttpResponseInterface<PaginatedData<Country[]>>> {
    const options = params
      ? {
          params: (() => {
            let httpParams = new HttpParams()
              .set(
                'page',
                params.page !== undefined ? params.page.toString() : '1'
              )
              .set(
                'limit',
                params.limit !== undefined ? params.limit.toString() : '-1'
              )
              .set('keyword', params.keyword ?? '');

            if (params.supported) {
              httpParams = httpParams.set(
                'supported',
                String(params.supported)
              );
            }
            if (params.supportingCustomer) {
              httpParams = httpParams.set(
                'supportingCustomer',
                String(params.supportingCustomer)
              );
            }
            if (params.supportingHost) {
              httpParams = httpParams.set(
                'supportingHost',
                String(params.supportingHost)
              );
            }
            return httpParams;
          })(),
        }
      : {};
    return this.http.get<HttpResponseInterface<PaginatedData<Country[]>>>(
      API_ENDPOINTS.GET_COUNTRIES,
      options
    );
  }

  /**
   * Fetch all countries only once and update the signal.
   * Components should use the signal for data.
   */
  async fetchAllCountries(): Promise<boolean> {
    if (!this.countriesLoaded()) {
      this.getCountries({
        page: 1,
        limit: -1, // Get all countries
      })
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.allCountries.set(res.data.data);
            this.countriesLoaded.set(true);
          },
          error: () => {
            this.countriesLoaded.set(false);
            this.allCountries.set([]);
          },
        });
    }
    return true;
  }

  async getCountryById(id: string): Promise<Country | undefined> {
    await this.fetchAllCountries();
    return this.allCountries().find((country) => country._id.toString() === id);
  }

  /**
   * Update country with partial data
   */
  updateCountry(
    id: string,
    updateData: UpdateCountry
  ): Observable<HttpResponseInterface<Country>> {
    return this.http
      .patch<HttpResponseInterface<Country>>(
        `${API_ENDPOINTS.GET_COUNTRIES}/${id}`,
        updateData
      )
      .pipe(tap(() => this.fetchAllCountries()));
  }
}
