import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { AppConstants } from '../../common/constants';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';
import { GeneralSettings, HttpResponseInterface } from '@newmbani/types';
import { Settings } from '@newmbani/types';
import { MediaService } from '../../common/services/media.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
   private httpClient: HttpClient = inject(HttpClient);
  private readonly mediaService = inject(MediaService);

  private _settings = signal<Settings | null>(null);
  settings = this._settings.asReadonly();

  /**
   * Loads the application settings during app initialization.
   * Fetches settings from the API and stores them in the _settings signal.
   * Returns an observable for use in an app initializer provider.
   */
  loadSettingsForInitializer(): Observable<Settings | null> {
    return new Observable<Settings | null>((observer) => {
      this.getSettings().subscribe({
        next: (res) => {
          this._settings.set(res.data);
          observer.next(res.data);
          observer.complete();
        },
        error: (err: HttpErrorResponse) => {
          this._settings.set(null);
          observer.next(null);
          observer.complete();
        },
      });
    });
  }

  /**
   * Get app name
   *
   * @return {*}
   * @memberof SettingsService
   */
  getAppName(): string {
    return AppConstants.appName;
  }

  /**
   * Get Settings
   *
   * @return {*}
   * @memberof ClientsService
   */
  getSettings(): Observable<HttpResponseInterface<Settings>> {
    return this.httpClient.get<HttpResponseInterface<Settings>>(
      API_ENDPOINTS.VIEW_SETTINGS
    );
  }

  /**
   * Updates the application settings-wrapper.
   *
   * @param {any} payload - The settings-wrapper data to update.
   * @returns {Observable<any>} An observable with the HTTP response.
   */
  updateGeneralSettings(
    payload: Partial<GeneralSettings>
  ): Observable<HttpResponseInterface<GeneralSettings>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_GENERAL_SETTINGS}`;
    return this.httpClient.patch<HttpResponseInterface<GeneralSettings>>(
      endpoint,
      payload
    );
  }
  updateBrandingSettings(
    payload: Partial<Settings>
  ): Observable<HttpResponseInterface<Settings>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_BRANDING_SETTINGS}`;
    return this.httpClient.patch<HttpResponseInterface<Settings>>(
      endpoint,
      payload
    );
  }

  /**
   * Get a sequence
   *
   * This method sends a GET request to the GET_SEQUENCE endpoint to retrieve
   * the next sequence number. It returns an Observable with the response.
   */
  getSequence() {
    try {
      const endpoint = `${API_ENDPOINTS.GET_SEQUENCE}`;
      return this.httpClient.get(endpoint);
    } catch (error) {
      return of(error);
    }
  }
  updateLogo(payload: FormData): Observable<HttpResponseInterface> {
    return this.mediaService.uploadMedia(payload);
  }
}
