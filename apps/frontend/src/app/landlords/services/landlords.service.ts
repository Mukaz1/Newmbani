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
  private httpClient: HttpClient = inject(HttpClient);

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
    keyword: string;
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
      API_ENDPOINTS.GET_LANDLORDS,
      options,
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
    landlordId: string,
  ): Observable<HttpResponseInterface<Landlord | null>> {
    const endpoint = API_ENDPOINTS.GET_LANDLORD(landlordId);
    return this.httpClient.get<HttpResponseInterface<Landlord | null>>(
      endpoint,
    );
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
    data: Partial<Landlord>,
  ): Observable<HttpResponseInterface<Landlord | null>> {
    const endpoint = API_ENDPOINTS.GET_LANDLORD(landlordId);
    return this.httpClient.patch<HttpResponseInterface<Landlord | null>>(
      endpoint,
      data,
    );
  }

  /**
   * Approve a landlord by Id
   *
   * @param {string} landlordId
   * @return {*} Observable<HttpResponseInterface<Landlord | null>>
   * @memberof LandlordsService
   */
  approveLandlord(
    landlordId: string,
    data:
      | {
          approvalStatus: string;
          approvalComment?: string;
          approvedBy?: string;
        }
      | Record<string, any> = {},
  ): Observable<HttpResponseInterface<Landlord | null>> {
    console.log(data);
    const endpoint = API_ENDPOINTS.APPROVE_LANDLORD(landlordId);
    return this.httpClient.patch<HttpResponseInterface<Landlord | null>>(
      endpoint,
      data,
    );
  }
}
