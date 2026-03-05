import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { catchError, map, Observable, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { PaginatedData, HttpResponseInterface, Currency, CurrencyCode } from '@newmbani/types';
import { API_ENDPOINTS } from '../routes.constants';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  public currency = signal<Currency | undefined>(undefined);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  currencies: Currency[] = [];
  private httpClient = inject(HttpClient);
  supportedCurrencies = signal<Currency[]>([]);

  async loadCurrenciesFromAPI() {
    try {
      const endpoint = `${API_ENDPOINTS.GET_CURRENCIES}`;
      this.httpClient
        .get<HttpResponseInterface<PaginatedData<Currency[]>>>(endpoint)
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            if (response.data.data) {
              this.currencies = response.data.data;
              this.supportedCurrencies.set(response.data.data);
            }
          },
          error: (e) => {
            console.log('Error Loading currencies: ', e);
          },
        });
    } catch (error) {
      console.error('Error loading currencies from API:', error);
    }
  }

  updateCurrency(c?: string): void {
    const currency = this.getCurrency(c);
    this.currency.set(currency);
  }

  getCurrency(c?: string) {
    const q = this.isBrowser ? sessionStorage.getItem('currencyCode') : CurrencyCode.KES;
    const curr: string = c ? c : q ? (q as string) : CurrencyCode.KES;

    const currency: Currency | undefined = this.currencies.find(
      (cu) => cu.code === curr
    );
    // update the currency
    if (this.isBrowser) {
      sessionStorage.setItem('currencyCode', currency?.code ?? CurrencyCode.KES);
    }
    this.currency.set(currency);

    return currency;
  }

  async loadCurrencies() {
    // Load from API first, then fallback to default
    await this.loadCurrenciesFromAPI();
    this.updateCurrency();
  }

  /**
   * Load currencies and return observable for app initializer
   */
  loadCurrenciesForInitializer(): Observable<Currency[]> {
    return this.httpClient
      .get<HttpResponseInterface<PaginatedData<Currency[]>>>(
        API_ENDPOINTS.GET_CURRENCIES
      )
      .pipe(
        map((response) => {
          if (response.data.data) {
            this.currencies = response.data.data;
            this.updateCurrency();
          }
          return response.data.data || [];
        }),
        catchError((error) => {
          console.error('❌ Error loading currencies:', error);
          return of([]);
        })
      );
  }
}
