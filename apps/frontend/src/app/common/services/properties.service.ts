import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../routes.constants';
import {
  CreateProperty,
  HttpResponseInterface,
  PaginatedData,
  Property,
} from '@newmbani/types';
import { SocketService } from '../../socket.io/socket-io.service';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService extends SocketService {
  httpClient = inject(HttpClient);

  constructor() {
    super();
  }

  searchProperties(req: {
    keyword: string;
    limit: number;
    slim: boolean;
    page: number;
  }) {
    this.emitMessage('propertiesearch', req);
  }
  emitMessage(eventName: string, data: any) {
    // Emit message logic here: e.g., call socket emit or similar
    // Example:
    // this.socket.emit(eventName, data);
    // For now, just a stub:
    return;
  }

  getAll(data?: {
    limit: number;
    page: number;
    keyword?: string;
    categoryId?: string;
    express: boolean;
  }): Observable<HttpResponseInterface<PaginatedData<Property[]>>> {
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('express', data.express)
            .set('categoryId', data.categoryId ? data.categoryId : '')
            .set('keyword', data.keyword ? data.keyword : ''),
        }
      : {};
    return this.httpClient.get<
      HttpResponseInterface<PaginatedData<Property[]>>
    >(API_ENDPOINTS.PROPERTIES, options);
  }

  /**
   * Get a single property by Id
   *
   * @param {string} propertyId
   * @return {*}
   * @memberof StorePropertiesService
   */
  getPropertyById(propertyId: string): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.VIEW_PROPERTY}/${propertyId}`;
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  createProperty(property: CreateProperty): Observable<HttpResponseInterface> {
    const endpoint = API_ENDPOINTS.CREATE_PROPERTY;
    return this.httpClient.post<HttpResponseInterface>(endpoint, property);
  }

  /**
   * Update a property by Id
   *
   * @param {string} propertyId
   * @param {Partial<CreateProperty>} property
   * @return {*}
   */
  updateProperty(
    propertyId: string,
    property: Partial<CreateProperty>
  ): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.VIEW_PROPERTY}/${propertyId}`;
    return this.httpClient.patch<HttpResponseInterface>(endpoint, property);
  }

  /**
   * Delete a property by Id
   *
   * @param {string} propertyId
   * @return {*}
   */
  deleteProperty(propertyId: string): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.VIEW_PROPERTY}/${propertyId}`;
    return this.httpClient.delete<HttpResponseInterface>(endpoint);
  }
}
