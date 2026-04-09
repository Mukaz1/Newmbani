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
  private http: HttpClient = inject(HttpClient);

  /**
   * Create a new property (BNB or Sale)
   */
  createProperty(
    property: CreateProperty,
  ): Observable<HttpResponseInterface<Property>> {
    return this.http.post<HttpResponseInterface<Property>>(
      API_ENDPOINTS.CREATE_PROPERTY,
      property,
    );
  }

  /**
   * Get paginated list of properties
   */
  getAllProperties(data?: {
    limit: number;
    page: number;
    keyword: string;
    categoryId?: string;
    subcategoryId?: string;
    approvalStatus?: PropertyApprovalStatus;
    landlordId?: string;
    propertyId?: string;
    slug?: string;
    rating?: number;
    minPrice?: number;
    maxPrice?: number;
    isAvailable?: boolean;
    location?: string;
    sort?: object;
  }): Observable<HttpResponseInterface<PaginatedData<Property[]>>> {
    let params = new HttpParams();

    if (data) {
      if (data.limit !== undefined)
        params = params.set('limit', data.limit.toString());
      if (data.page !== undefined)
        params = params.set('page', data.page.toString());
      if (data.keyword !== undefined) params = params.set('keyword', data.keyword);
      if (data.categoryId) params = params.set('categoryId', data.categoryId);
      if (data.subcategoryId)
        params = params.set('subcategoryId', data.subcategoryId);
      if (data.approvalStatus)
        params = params.set('approvalStatus', data.approvalStatus);
      if (data.landlordId) params = params.set('landlordId', data.landlordId);
      if (data.propertyId) params = params.set('propertyId', data.propertyId);
      if (data.slug) params = params.set('slug', data.slug);
      if (data.rating !== undefined)
        params = params.set('rating', data.rating.toString());
      if (data.minPrice !== undefined)
        params = params.set('minPrice', data.minPrice.toString());
      if (data.maxPrice !== undefined)
        params = params.set('maxPrice', data.maxPrice.toString());
      if (data.isAvailable !== undefined)
        params = params.set('isAvailable', data.isAvailable.toString());
      if (data.location) params = params.set('location', data.location);
      if (data.sort) params = params.set('sort', JSON.stringify(data.sort));
    }
    return this.http.get<HttpResponseInterface<PaginatedData<Property[]>>>(
      API_ENDPOINTS.GET_PROPERTIES,
      { params },
    );
  }

  /**
   * Get a single property by ID or slug
   */
  getPropertyByIdOrSlug(
    idOrSlug: string,
  ): Observable<HttpResponseInterface<Property>> {
    return this.http.get<HttpResponseInterface<Property>>(
      API_ENDPOINTS.GET_PROPERTY(idOrSlug),
    );
  }

  /**
   * Update property
   */
  updateProperty(
    propertyId: string,
    property: Partial<Property>,
  ): Observable<HttpResponseInterface<Partial<Property>>> {
    return this.http.patch<HttpResponseInterface<Partial<Property>>>(
      API_ENDPOINTS.UPDATE_PROPERTY(propertyId),
      property,
    );
  }

  /**
   * Delete property
   */
  deleteProperty(propertyId: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      API_ENDPOINTS.DELETE_PROPERTY(propertyId),
    );
  }

  /**
   * Remove a property image
   */
  removePropertyImage(
    propertyId: string,
  ): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      API_ENDPOINTS.DELETE_PROPERTY_IMAGE(propertyId),
    );
  }

  /**
   * Review property (approve or reject)
   * @param propertyId The id of the property to review
   * @param reviewDto The review payload (status, reason, etc)
   */
  reviewProperty(data: {
    propertyId: string;
    status: string;
    reviewComment: string;
  }): Observable<HttpResponseInterface<any>> {
    const { propertyId, status, reviewComment } = data;
    const endpoint = API_ENDPOINTS.REVIEW_PROPERTY(propertyId);
    const payload = {
      status,
      reviewComment,
    };
    return this.http.patch<HttpResponseInterface<any>>(endpoint, payload);
  }
}
