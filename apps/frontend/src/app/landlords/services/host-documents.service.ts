import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HttpResponseInterface,
  HostDocument,
  FileTypesEnum,
  HostDocumentStatus,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class HostDocumentsService {
  private httpClient = inject(HttpClient);

  /**
   * Get all host documents
   *
   * @param {{
   *     limit?: number;
   *     page?: number;
   *     keyword?: string;
   *     // Add more if needed
   *   }} [query]
   * @return {*}
   * @memberof HostDocumentsService
   */
  getAllHostDocuments(query?: {
    limit?: number;
    page?: number;
    keyword?: string;
    hostId?: string;
  }): Observable<HttpResponseInterface<HostDocument[] | null>> {
    let params = new HttpParams();
    if (query) {
      if (typeof query.page === 'number')
        params = params.set('page', String(query.page));
      if (typeof query.limit === 'number')
        params = params.set('limit', String(query.limit));
      if (query.keyword) params = params.set('keyword', query.keyword);
      if (query.hostId) params = params.set('hostId', query.hostId);
    }

    return this.httpClient.get<HttpResponseInterface<HostDocument[] | null>>(
      API_ENDPOINTS.GET_HOST_DOCUMENTS,
      { params }
    );
  }

  /**
   * Create/Upload a host document
   *
   * @param {{
   *   hostId?: string;
   *   documentId: string;
   *   expiryDate: string;
   *   file: File;
   * }} data
   * @return {*}
   * @memberof HostDocumentsService
   */
  createHostDocument(data: {
    hostId?: string;
    documentId: string;
    file: File;
  }): Observable<HttpResponseInterface<HostDocument | null>> {
    const formData = new FormData();
    if (data.hostId) {
      formData.append('hostId', data.hostId);
    }
    formData.append('documentId', data.documentId);
    formData.append('expiryDate', new Date().toISOString());
    formData.append('file', data.file);

    return this.httpClient.post<HttpResponseInterface<HostDocument | null>>(
      API_ENDPOINTS.CREATE_HOST_DOCUMENT,
      formData
    );
  }

  uploadHostDocument(payload: { file: File; reference: string }) {
    const { reference, file } = payload;
    const data = new FormData();
    data.append('file', file);
    data.append('reference', reference);
    data.append('type', FileTypesEnum.HOST_DOCUMENT);

    return this.httpClient.post<HttpResponseInterface<HostDocument>>(
      API_ENDPOINTS.UPLOAD_FILE,
      data
    );
  }

  reviewHostDocument(data: {
    documentId: string;
    comment: string;
    status: HostDocumentStatus;
  }): Observable<HttpResponseInterface<HostDocument>> {
    const { documentId, comment, status } = data;
    const endpoint = `${API_ENDPOINTS.GET_HOST_DOCUMENTS}/${documentId}/review`;
    const payload = {
      comment,
      status,
    };
    return this.httpClient.post<HttpResponseInterface<HostDocument>>(
      endpoint,
      payload
    );
  }

  /**
   * Resubmit a host document (for rejected/pending)
   *
   * @param {{
   *   documentId: string;
   *   expiryDate: string;
   *   file: File;
   * }} data
   * @return {*}
   * @memberof HostDocumentsService
   */
  resubmitHostDocument(data: {
    documentId: string;
    expiryDate: string;
    file: File;
  }): Observable<HttpResponseInterface<HostDocument>> {
    const { documentId, expiryDate, file } = data;
    const endpoint = `${API_ENDPOINTS.RESUBMIT_HOST_DOCUMENT}/${documentId}/resubmit`;
    const formData = new FormData();
    formData.append('expiryDate', expiryDate);
    formData.append('file', file);
    return this.httpClient.post<HttpResponseInterface<HostDocument>>(
      endpoint,
      formData
    );
  }
}
