import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_ENDPOINTS } from '../../../common/routes.constants';
import { CreateProperty, HttpResponseInterface, Property } from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class HostPropertiesService {
  private httpClient = inject(HttpClient);

  getAll(data?: {
    limit: number;
    page: number;
    keyword?: string;
    categoryId?: string;
    hostId: string;
    express: boolean;
  }) {
    try {
      const options = data
        ? {
            params: new HttpParams()
              .set('limit', data.limit)
              .set('page', data.page)
              .set('express', data.express)
              .set('categoryId', data.categoryId ? data.categoryId : '')
              .set('hostId', data.hostId)
              .set('keyword', data.keyword ? data.keyword : ''),
          }
        : {};
      return this.httpClient.get(API_ENDPOINTS.ALL_PROPERTIES, options);
    } catch (error) {
      return of(error);
    }
  }

  /**
   * Get a single property by Id
   *
   * @param {string} propertyId
   * @return {*}
   * @memberof StorePropertiesService
   */
  getPropertyById(
    propertyId: string
  ): Observable<HttpResponseInterface<Property | null>> {
    const endpoint = `${API_ENDPOINTS.VIEW_PROPERTY}/${propertyId}`;
    return this.httpClient.get<HttpResponseInterface<Property | null>>(
      endpoint
    );
  }

  createProperty(
    property: CreateProperty
  ): Observable<HttpResponseInterface<Property | null>> {
    const endpoint = API_ENDPOINTS.CREATE_PROPERTY;
    return this.httpClient.post<HttpResponseInterface<Property | null>>(
      endpoint,
      property
    );
  }
}
