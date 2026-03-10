import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponseInterface } from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private readonly httpClient = inject(HttpClient);

  uploadMedia(payload: FormData) {
    const endpoint = API_ENDPOINTS.UPLOAD_FILE;

    // Properly log FormData by iterating over entries
    // Note: FormData.entries() exists at runtime but TypeScript definitions may not include it
    const formDataEntries: { [key: string]: any } = {};
    try {
      // Type assertion to access entries() method which exists at runtime
      const formDataAsAny = payload as any;
      const entriesIterator = formDataAsAny.entries();
      if (entriesIterator) {
        // Use Array.from to convert FormData entries to an array for iteration
        const entries = Array.from(entriesIterator) as [
          string,
          File | string
        ][];
        for (const [key, value] of entries) {
          if (value instanceof File) {
            formDataEntries[key] = {
              name: value.name,
              size: value.size,
              type: value.type,
              lastModified: value.lastModified,
            };
          } else {
            formDataEntries[key] = value;
          }
        }
      }
    } catch (error) {
      // Fallback if entries() is not available
      console.log(
        'FormData in service: (unable to inspect FormData structure)'
      );
    }

    return this.httpClient.post<HttpResponseInterface>(endpoint, payload);
  }

  uploadMultipleMedia(payload: FormData) {
    const endpoint = API_ENDPOINTS.UPLOAD_MULTIPLE_FILES;
    return this.httpClient.post<HttpResponseInterface>(endpoint, payload);
  }

  downloadFile(fileName: string): Observable<Blob> {
    const endpoint = API_ENDPOINTS.DOWNLOAD_FILE;
    return this.httpClient.get(`${endpoint}/${fileName}`, {
      responseType: 'blob',
    });
  }

  viewFile(fileName: string): Observable<HttpResponseInterface> {
    return this.httpClient.post<HttpResponseInterface>(
      API_ENDPOINTS.VIEW_FILE,
      { fileName }
    );
  }
}
