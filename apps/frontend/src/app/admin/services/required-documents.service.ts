import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CreateRequiredDocument,
  HttpResponseInterface,
  PaginatedData,
  RequiredDocument,
} from '@newmbani/types';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class RequiredDocumentsService {
  private readonly http = inject(HttpClient);

  getRequiredDocuments(): Observable<
    HttpResponseInterface<PaginatedData<RequiredDocument[]>>
  > {
    return this.http.get<
      HttpResponseInterface<PaginatedData<RequiredDocument[]>>
    >(API_ENDPOINTS.GET_REQUIRED_DOCUMENTS);
  }

  updateRequiredDocument(
    id: string,
    payload: CreateRequiredDocument
  ): Observable<HttpResponseInterface<RequiredDocument>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_REQUIRED_DOCUMENT}/${id}`;
    return this.http.patch<HttpResponseInterface<RequiredDocument>>(
      endpoint,
      payload
    );
  }

  createRequiredDocument(
    payload: CreateRequiredDocument
  ): Observable<HttpResponseInterface<RequiredDocument>> {
    return this.http.post<HttpResponseInterface<RequiredDocument>>(
      API_ENDPOINTS.CREATE_REQUIRED_DOCUMENT,
      payload
    );
  }
}
