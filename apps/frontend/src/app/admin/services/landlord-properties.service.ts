import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreateProperty, HttpResponseInterface, Property } from '@newmbani/types';
import { API_ENDPOINTS } from '@newmbani/shared';

@Injectable({
  providedIn: 'root',
})
export class LandlordPropertiesService {
   private httpClient: HttpClient = inject(HttpClient);

  getAll(data?: {
    limit: number;
    page: number;
    keyword?: string;
    categoryId?: string;
    landlordId: string;
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
              .set('landlordId', data.landlordId)
              .set('keyword', data.keyword ? data.keyword : ''),
          }
        : {};
      return this.httpClient.get(API_ENDPOINTS.GET_PROPERTIES, options);
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
    const endpoint = API_ENDPOINTS.GET_PROPERTY(propertyId);
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
