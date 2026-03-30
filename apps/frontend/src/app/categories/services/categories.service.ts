import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  HttpResponseInterface,
  PaginatedData,
  PropertyCategory,
  PropertiesSubCategory,
  CreatePropertiesSubCategory,
  CreatePropertyCategory,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

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
    id: string
  ): Observable<HttpResponseInterface<PropertyCategory>> {
    return this.http.get<HttpResponseInterface<PropertyCategory>>(
     API_ENDPOINTS.GET_PROPERTY_CATEGORY(id)
    );
  }

  createCategory(
    category: Omit<CreatePropertyCategory, '_id'>
  ): Observable<HttpResponseInterface<CreatePropertyCategory>> {
    return this.http.post<HttpResponseInterface<CreatePropertyCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_CATEGORY,
      category
    );
  }

  updateCategory(
    id: string,
    category: Partial<CreatePropertyCategory>
  ): Observable<HttpResponseInterface<PropertyCategory>> {
    return this.http.patch<HttpResponseInterface<PropertyCategory>>(
      API_ENDPOINTS.UPDATE_PROPERTY_CATEGORY(id),
      category
    );
  }

  deleteCategory(id: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
     API_ENDPOINTS.DELETE_PROPERTY_CATEGORY(id)
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
  }): Observable<HttpResponseInterface<PaginatedData<PropertiesSubCategory[]>>> {
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
      HttpResponseInterface<PaginatedData<PropertiesSubCategory[]>>
    >(API_ENDPOINTS.GET_PROPERTY_SUBCATEGORIES, options);
  }

  getSubcategoryById(
    id: string
  ): Observable<HttpResponseInterface<PropertiesSubCategory>> {
    return this.http.get<HttpResponseInterface<PropertiesSubCategory>>(
    API_ENDPOINTS.GET_PROPERTY_SUBCATEGORY(id)
    );
  }

  createSubcategory(
    subcategory: Omit<CreatePropertiesSubCategory, '_id'>
  ): Observable<HttpResponseInterface<CreatePropertiesSubCategory>> {
    return this.http.post<HttpResponseInterface<CreatePropertiesSubCategory>>(
      API_ENDPOINTS.CREATE_PROPERTY_SUBCATEGORY,
      subcategory
    );
  }

  updateSubcategory(
    id: string,
    subcategory: Partial<PropertiesSubCategory>
  ): Observable<HttpResponseInterface<PropertiesSubCategory>> {
    return this.http.patch<HttpResponseInterface<PropertiesSubCategory>>(
     API_ENDPOINTS.UPDATE_PROPERTY_SUBCATEGORY(id),
      subcategory
    );
  }

  deleteSubcategory(id: string): Observable<HttpResponseInterface<void>> {
    return this.http.delete<HttpResponseInterface<void>>(
     API_ENDPOINTS.DELETE_PROPERTY_SUBCATEGORY(id)
    );
  }
}
