import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  HttpResponseInterface,
  LandlordDocument,
  FileTypesEnum,
  LandlordDocumentStatus,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class LandlordDocumentsService {
  private httpClient = inject(HttpClient);

  /**
   * Get all landlord documents
   *
   * @param {{
   *     limit?: number;
   *     page?: number;
   *     keyword?: string;
   *     // Add more if needed
   *   }} [query]
   * @return {*}
   * @memberof LandlordDocumentsService
   */
  getAllLandlordDocuments(query?: {
    limit?: number;
    page?: number;
    keyword?: string;
    landlordId?: string;
  }): Observable<HttpResponseInterface<LandlordDocument[] | null>> {
    let params = new HttpParams();
    if (query) {
      if (typeof query.page === 'number')
        params = params.set('page', String(query.page));
      if (typeof query.limit === 'number')
        params = params.set('limit', String(query.limit));
      if (query.keyword) params = params.set('keyword', query.keyword);
      if (query.landlordId) params = params.set('landlordId', query.landlordId);
    }

    return this.httpClient.get<HttpResponseInterface<LandlordDocument[] | null>>(
      API_ENDPOINTS.GET_LANDLORD_DOCUMENTS,
      { params }
    );
  }

  /**
   * Create/Upload a landlord document
   *
   * @param {{
   *   landlordId?: string;
   *   documentId: string;
   *   expiryDate: string;
   *   file: File;
   * }} data
   * @return {*}
   * @memberof LandlordDocumentsService
   */
  createLandlordDocument(data: {
    landlordId?: string;
    documentId: string;
    file: File;
  }): Observable<HttpResponseInterface<LandlordDocument | null>> {
    const formData = new FormData();
    if (data.landlordId) {
      formData.append('landlordId', data.landlordId);
    }
    formData.append('documentId', data.documentId);
    formData.append('expiryDate', new Date().toISOString());
    formData.append('file', data.file);

    return this.httpClient.post<HttpResponseInterface<LandlordDocument | null>>(
      API_ENDPOINTS.CREATE_LANDLORD_DOCUMENT,
      formData
    );
  }

  uploadLandlordDocument(payload: { file: File; reference: string }) {
    const { reference, file } = payload;
    const data = new FormData();
    data.append('file', file);
    data.append('reference', reference);
    data.append('type', FileTypesEnum.LANDLORD_DOCUMENT);

    return this.httpClient.post<HttpResponseInterface<LandlordDocument>>(
      API_ENDPOINTS.UPLOAD_FILE,
      data
    );
  }

  reviewLandlordDocument(data: {
    documentId: string;
    comment: string;
    status: LandlordDocumentStatus;
  }): Observable<HttpResponseInterface<LandlordDocument>> {
    const { documentId, comment, status } = data;
    const endpoint = `${API_ENDPOINTS.GET_LANDLORD_DOCUMENTS}/${documentId}/review`;
    const payload = {
      comment,
      status,
    };
    return this.httpClient.post<HttpResponseInterface<LandlordDocument>>(
      endpoint,
      payload
    );
  }

  /**
   * Resubmit a landlord document (for rejected/pending)
   *
   * @param {{
   *   documentId: string;
   *   expiryDate: string;
   *   file: File;
   * }} data
   * @return {*}
   * @memberof LandlordDocumentsService
   */
  resubmitLandlordDocument(data: {
    documentId: string;
    expiryDate: string;
    file: File;
  }): Observable<HttpResponseInterface<LandlordDocument>> {
    const { documentId, expiryDate, file } = data;
    const endpoint = `${API_ENDPOINTS.RESUBMIT_LANDLORD_DOCUMENT}/${documentId}/resubmit`;
    const formData = new FormData();
    formData.append('expiryDate', expiryDate);
    formData.append('file', file);
    return this.httpClient.post<HttpResponseInterface<LandlordDocument>>(
      endpoint,
      formData
    );
  }
}
