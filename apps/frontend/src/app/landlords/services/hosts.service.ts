/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpResponseInterface, Host } from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class HostsService {
  private httpClient = inject(HttpClient);

  /**
   * Get all hosts
   *
   * @param {{
   *     limit: number;
   *     page: number;
   *     keyword?: string;
   *   }} [data]
   * @return {*}
   * @memberof HostsService
   */
  getAllHosts(data?: {
    limit: number;
    page: number;
    keyword?: string;
  }): Observable<HttpResponseInterface<Host[] | null>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('keyword', data.keyword ? data.keyword : ''),
        }
      : {};
    return this.httpClient.get<HttpResponseInterface<Host[] | null>>(
      API_ENDPOINTS.GET_HOSTS_FROM_STORE,
      options
    );
  }

  /**
   * Get a host profile by Id
   *
   * @param {string} hostId
   * @return {*}
   * @memberof HostsService
   */
  getHostProfileById(
    hostId: string
  ): Observable<HttpResponseInterface<Host | null>> {
    const endpoint = `${API_ENDPOINTS.GET_HOST_PROFILE_FROM_STORE}/${hostId}`;
    return this.httpClient.get<HttpResponseInterface<Host | null>>(endpoint);
  }

  /**
   * Update a host profile by Id (e.g., for verification)
   *
   * @param {string} hostId
   * @param {Partial<Host>} data
   * @return {*}
   * @memberof HostsService
   */
  updateHostProfileById(
    hostId: string,
    data: Partial<Host>
  ): Observable<HttpResponseInterface<Host | null>> {
    const endpoint = `${API_ENDPOINTS.GET_HOST_PROFILE_FROM_STORE}/${hostId}`;
    return this.httpClient.patch<HttpResponseInterface<Host | null>>(
      endpoint,
      data
    );
  }

  /**
   * Approve a host by Id
   *
   * @param {string} hostId
   * @return {*} Observable<HttpResponseInterface<Host | null>>
   * @memberof HostsService
   */
  approveHost(hostId: string): Observable<HttpResponseInterface<Host | null>> {
    // The endpoint is hosts/:id/approve (PATCH)
    const endpoint = `${API_ENDPOINTS.APPROVE_HOST}/${hostId}/approve`;
    return this.httpClient.patch<HttpResponseInterface<Host | null>>(
      endpoint,
      {}
    );
  }
}
