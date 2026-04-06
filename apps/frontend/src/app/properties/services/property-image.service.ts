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
  private http: HttpClient = inject(HttpClient);

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
    let params = new HttpParams();
    if (data?.limit != null) {
      params = params.set('limit', data.limit.toString());
    }
    if (data?.page != null) {
      params = params.set('page', data.page.toString());
    }
    if (data?.keyword != null) {
      params = params.set('keyword', data.keyword);
    }

    const endpoint = API_ENDPOINTS.GET_PROPERTY_IMAGE_CATEGORIES;

    return this.http.get<
      HttpResponseInterface<PaginatedData<PropertyImageCategory[]>>
    >(endpoint, { params });
  }

  getPropertyImageCategoryById(
    id: string,
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.get<HttpResponseInterface<PropertyImageCategory>>(
      API_ENDPOINTS.GET_PROPERTY_IMAGE_CATEGORY(id),
    );
  }

  createPropertyImageCategory(
    category: Omit<CreatePropertyImageCategory, '_id'>,
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.post<HttpResponseInterface<PropertyImageCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_IMAGE_CATEGORY,
      category,
    );
  }

  updatePropertyImageCategory(
    id: string,
    category: Partial<CreatePropertyImageCategory>,
  ): Observable<HttpResponseInterface<PropertyImageCategory>> {
    return this.http.patch<HttpResponseInterface<PropertyImageCategory>>(
      API_ENDPOINTS.UPDATE_PROPERTY_IMAGE_CATEGORY(id),
      category,
    );
  }

  deletePropertyImageCategory(
    id: string,
  ): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      API_ENDPOINTS.DELETE_PROPERTY_IMAGE_CATEGORY(id),
    );
  }

  uploadPropertyImages(
    formData: FormData,
  ): Observable<HttpResponseInterface<any>> {
    return this.http.post<HttpResponseInterface<any>>(
      API_ENDPOINTS.UPLOAD_PROPERTY_IMAGE,
      formData,
    );
  }

  reviewProperty(data: {
    propertyImageId: string;
    payload: PropertyImageReviewInterface;
  }): Observable<HttpResponseInterface<PropertyImage>> {
    const { propertyImageId, payload } = data;
    const endpoint = API_ENDPOINTS.REVIEW_PROPERTY_IMAGE(propertyImageId);
    return this.http.patch<HttpResponseInterface<PropertyImage>>(
      endpoint,
      payload,
    );
  }

  changePropertyImageCategory(data: {
    propertyImageId: string;
    payload: UpdatePropertyImage;
  }): Observable<HttpResponseInterface<PropertyImage>> {
    const { propertyImageId, payload } = data;
    const endpoint = API_ENDPOINTS.UPDATE_PROPERTY_IMAGE(propertyImageId);
    return this.http.patch<HttpResponseInterface<PropertyImage>>(
      endpoint,
      payload,
    );
  }
}
