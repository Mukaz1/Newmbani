

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateProperty,
  HttpResponseInterface,
  PaginatedData,
  Property,
  PropertyApprovalStatus,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private http = inject(HttpClient);

  /**
   * Create a new property (BNB or Sale)
   */
  createProperty(
    property: CreateProperty
  ): Observable<HttpResponseInterface<Property>> {
    return this.http.post<HttpResponseInterface<Property>>(
      API_ENDPOINTS.CREATE_PROPERTY,
      property
    );
  }

  /**
   * Get paginated list of properties
   */
  getAllProperties(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
    categoryId?: string;
    approvalStatus?: PropertyApprovalStatus;
    subcategoryId?: string;
    landlordId?: string;
    listingTypeId?: string;
    countryId?: string;
  }): Observable<HttpResponseInterface<PaginatedData<Property[]>>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit?.toString() ?? '')
            .set('page', data.page?.toString() ?? '')
            .set('keyword', data.keyword ?? '')
            .set('categoryId', data.categoryId ?? '')
            .set('landlordId', data.landlordId ?? '')
            .set('countryId', data.countryId ?? '')
            .set('approvalStatus', data.approvalStatus ?? ''),
        }
      : {};
    return this.http.get<HttpResponseInterface<PaginatedData<Property[]>>>(
      API_ENDPOINTS.PROPERTIES,
      options
    );
  }

  /**
   * Get a single property by ID or slug
   */
  getPropertyByIdOrSlug(
    idOrSlug: string
  ): Observable<HttpResponseInterface<Property>> {
    return this.http.get<HttpResponseInterface<Property>>(
      `${API_ENDPOINTS.VIEW_PROPERTY}/${idOrSlug}`
    );
  }

  /**
   * Update property
   */
  updateProperty(
    propertyId: string,
    property: Partial<Property>
  ): Observable<HttpResponseInterface<Partial<Property>>> {
    return this.http.patch<HttpResponseInterface<Partial<Property>>>(
      `${API_ENDPOINTS.UPDATE_PROPERTY}/${propertyId}`,
      property
    );
  }

  /**
   * Delete property
   */
  deleteProperty(propertyId: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      `${API_ENDPOINTS.PROPERTIES}/${propertyId}`
    );
  }
}