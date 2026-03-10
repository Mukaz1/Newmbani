/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponseInterface, Landlord } from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class LandlordsService {
  private httpClient = inject(HttpClient);

  /**
   * Get all landlords
   *
   * @param {{
   *     limit: number;
   *     page: number;
   *     keyword?: string;
   *   }} [data]
   * @return {*}
   * @memberof LandlordsService
   */
  getAllLandlords(data?: {
    limit: number;
    page: number;
    keyword?: string;
  }): Observable<HttpResponseInterface<Landlord[] | null>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('keyword', data.keyword ? data.keyword : ''),
        }
      : {};
    return this.httpClient.get<HttpResponseInterface<Landlord[] | null>>(
      API_ENDPOINTS.GET_LANDLORDS_FROM_STORE,
      options
    );
  }

  /**
   * Get a landlord profile by Id
   *
   * @param {string} landlordId
   * @return {*}
   * @memberof LandlordsService
   */
  getLandlordProfileById(
    landlordId: string
  ): Observable<HttpResponseInterface<Landlord | null>> {
    const endpoint = `${API_ENDPOINTS.GET_LANDLORD_PROFILE_FROM_STORE}/${landlordId}`;
    return this.httpClient.get<HttpResponseInterface<Landlord | null>>(endpoint);
  }

  /**
   * Update a landlord profile by Id (e.g., for verification)
   *
   * @param {string} landlordId
   * @param {Partial<Landlord>} data
   * @return {*}
   * @memberof LandlordsService
   */
  updateLandlordProfileById(
    landlordId: string,
    data: Partial<Landlord>
  ): Observable<HttpResponseInterface<Landlord | null>> {
    const endpoint = `${API_ENDPOINTS.GET_LANDLORD_PROFILE_FROM_STORE}/${landlordId}`;
    return this.httpClient.patch<HttpResponseInterface<Landlord | null>>(
      endpoint,
      data
    );
  }

  /**
   * Approve a landlord by Id
   *
   * @param {string} landlordId
   * @return {*} Observable<HttpResponseInterface<Landlord | null>>
   * @memberof LandlordsService
   */
  approveLandlord(landlordId: string): Observable<HttpResponseInterface<Landlord | null>> {
    // The endpoint is landlords/:id/approve (PATCH)
    const endpoint = `${API_ENDPOINTS.APPROVE_LANDLORD}/${landlordId}/approve`;
    return this.httpClient.patch<HttpResponseInterface<Landlord | null>>(
      endpoint,
      {}
    );
  }
}
