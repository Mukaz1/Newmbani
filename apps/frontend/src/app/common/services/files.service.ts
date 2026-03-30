import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../routes.constants';
import { FileInterface, HttpResponseInterface } from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
   private httpClient: HttpClient = inject(HttpClient);

  getFile(fileId: string): Observable<HttpResponseInterface<FileInterface>> {
    const endpoint = `${API_ENDPOINTS.VIEW_FILE}/${fileId}`;
    return this.httpClient.get<HttpResponseInterface<FileInterface>>(endpoint);
  }

  getAllFiles(): Observable<HttpResponseInterface<FileInterface[]>> {
    return this.httpClient.get<HttpResponseInterface<FileInterface[]>>(
      API_ENDPOINTS.VIEW_FILE
    );
  }
}
