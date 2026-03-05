import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, take, finalize } from 'rxjs/operators';
import { CountriesService } from '../../countries/services/countries.service';
import { CurrencyService } from './currency.service';
import { AppStateService } from './app-state.service';
import { SettingsService } from '../../settings/services/settings.service';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  private countriesService = inject(CountriesService);
  private currencyService = inject(CurrencyService);
  private appStateService = inject(AppStateService);
  private settingsService = inject(SettingsService);

  /**
   * Initialize app by loading all required data
   * This ensures countries, supported countries, and currencies are available
   * before the app becomes interactive
   */
  initialize(): Observable<boolean> {
    console.log('🚀 Starting app initialization...');

    const requests = [
      this.countriesService.fetchAllCountries(),
      this.currencyService.loadCurrenciesForInitializer(),
      this.settingsService.loadSettingsForInitializer()

    ];

    return forkJoin(requests).pipe(
      map(() => {
        console.log('✅ App initialization completed successfully');
        return true;
      }),
      catchError((error) => {
        console.error('❌ Error during app initialization:', error);
        // Return true to allow app to continue even if some data fails to load
        // The individual services will handle their own error states
        return of(true);
      }),
      finalize(() => {
        // Mark app as initialized regardless of success/failure
        this.appStateService.setInitialized();
        console.log('🏁 App initialization process finished');
      }),
      take(1)
    );
  }
}
