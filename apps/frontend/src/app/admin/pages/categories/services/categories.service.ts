import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpResponseInterface,
  PaginatedData,
  PropertyCategory,
  PropertySubCategory,
  CreatePropertySubCategory,
  CreatePropertyCategory,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http: HttpClient = inject(HttpClient);

  // ---------------------------
  // Categories
  // ---------------------------

  getCategories(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
  }): Observable<HttpResponseInterface<PaginatedData<PropertyCategory[]>>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit?.toString() ?? '')
            .set('page', data.page?.toString() ?? '')
            .set('keyword', data.keyword ?? ''),
        }
      : {};
    return this.http.get<
      HttpResponseInterface<PaginatedData<PropertyCategory[]>>
    >(API_ENDPOINTS.GET_PROPERTY_CATEGORIES, options);
  }

  getCategoryById(
    id: string,
  ): Observable<HttpResponseInterface<PropertyCategory>> {
    return this.http.get<HttpResponseInterface<PropertyCategory>>(
      API_ENDPOINTS.GET_PROPERTY_CATEGORY(id),
    );
  }

  createCategory(
    category: Omit<CreatePropertyCategory, '_id'>,
  ): Observable<HttpResponseInterface<CreatePropertyCategory>> {
    return this.http.post<HttpResponseInterface<CreatePropertyCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_CATEGORY,
      category,
    );
  }

  updateCategory(
    id: string,
    category: Partial<CreatePropertyCategory>,
  ): Observable<HttpResponseInterface<PropertyCategory>> {
    return this.http.patch<HttpResponseInterface<PropertyCategory>>(
      API_ENDPOINTS.UPDATE_PROPERTY_CATEGORY(id),
      category,
    );
  }

  deleteCategory(id: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      API_ENDPOINTS.DELETE_PROPERTY_CATEGORY(id),
    );
  }

  // ---------------------------
  // Subcategories
  // ---------------------------

  getSubcategories(data?: {
    limit?: number;
    page?: number;
    keyword?: string;
    categoryId?: string;
  }): Observable<HttpResponseInterface<PaginatedData<PropertySubCategory[]>>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit?.toString() ?? '')
            .set('page', data.page?.toString() ?? '')
            .set('keyword', data.keyword ?? '')
            .set('categoryId', data.categoryId ?? ''),
        }
      : {};
    return this.http.get<
      HttpResponseInterface<PaginatedData<PropertySubCategory[]>>
    >(API_ENDPOINTS.GET_PROPERTY_SUBCATEGORIES, options);
  }

  getSubcategoryById(
    id: string,
  ): Observable<HttpResponseInterface<PropertySubCategory>> {
    return this.http.get<HttpResponseInterface<PropertySubCategory>>(
      API_ENDPOINTS.GET_PROPERTY_SUBCATEGORY(id),
    );
  }

  createSubcategory(
    subcategory: Omit<CreatePropertySubCategory, '_id'>,
  ): Observable<HttpResponseInterface<CreatePropertySubCategory>> {
    return this.http.post<HttpResponseInterface<CreatePropertySubCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_SUBCATEGORY,
      subcategory,
    );
  }

  updateSubcategory(
    id: string,
    subcategory: Partial<PropertySubCategory>,
  ): Observable<HttpResponseInterface<PropertySubCategory>> {
    return this.http.patch<HttpResponseInterface<PropertySubCategory>>(
      API_ENDPOINTS.UPDATE_PROPERTY_SUBCATEGORY(id),
      subcategory,
    );
  }

  deleteSubcategory(id: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
      API_ENDPOINTS.DELETE_PROPERTY_SUBCATEGORY(id),
    );
  }
}
