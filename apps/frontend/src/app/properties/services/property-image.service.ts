import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpResponseInterface,
  PaginatedData,
  PropertyImageCategory,
  CreatePropertyImageCategory,
  PropertyImage,
  PropertyImageReviewInterface,
  UpdatePropertyImage,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class PropertyImagesService {
  private http = inject(HttpClient);

  // ---------------------------
  // Property Image Categories
  // ---------------------------

  getPropertyImageCategories(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
  }): Observable<
    HttpResponseInterface<PaginatedData<PropertyImageCategory[]>>
  > {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit?.toString() ?? '')
            .set('page', data.page?.toString() ?? '')
            .set('keyword', data.keyword ?? ''),
        }
      : {};
    return this.http.get<
      HttpResponseInterface<PaginatedData<PropertyImageCategory[]>>
    >(API_ENDPOINTS.PROPERTY_IMAGE_CATEGORIES, options);
  }

  getPropertyImageCategoryById(
    id: string
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.get<HttpResponseInterface<PropertyImageCategory>>(
      `${API_ENDPOINTS.VIEW_PROPERTY_IMAGE_CATEGORY}/${id}`
    );
  }

  createPropertyImageCategory(
    category: Omit<CreatePropertyImageCategory, '_id'>
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.post<HttpResponseInterface<PropertyImageCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_IMAGE_CATEGORY,
      category
    );
  }

  updatePropertyImageCategory(
    id: string,
    category: Partial<CreatePropertyImageCategory>
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.patch<HttpResponseInterface<PropertyImageCategory>>(
      `${API_ENDPOINTS.UPDATE_PROPERTY_IMAGE_CATEGORY}/${id}`,
      category
    );
  }

  deletePropertyImageCategory(
    id: string
  ): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      `${API_ENDPOINTS.PROPERTY_IMAGE_CATEGORIES}/${id}`
    );
  }

  uploadPropertyImages(
    formData: FormData
  ): Observable<HttpResponseInterface<any>> {
    return this.http.post<HttpResponseInterface<any>>(
      API_ENDPOINTS.PROPERTY_IMAGES,
      formData
    );
  }

  reviewProperty(data: {
    propertyImageId: string;
    payload: PropertyImageReviewInterface;
  }): Observable<HttpResponseInterface<PropertyImage>> {
    const { propertyImageId, payload } = data;
    const endpoint = `${API_ENDPOINTS.PROPERTY_IMAGES}/${propertyImageId}/review`;
    return this.http.patch<HttpResponseInterface<PropertyImage>>(
      endpoint,
      payload
    );
  }

  changePropertyImageCategory(data: {
    propertyImageId: string;
    payload: UpdatePropertyImage;
  }): Observable<HttpResponseInterface<PropertyImage>> {
    const { propertyImageId, payload } = data;
    const endpoint = `${API_ENDPOINTS.PROPERTY_IMAGES}/${propertyImageId}`;
    return this.http.patch<HttpResponseInterface<PropertyImage>>(
      endpoint,
      payload
    );
  }
}
