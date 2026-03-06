import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpResponseInterface, Host } from '@newmbani/types';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class HostsService {
  http = inject(HttpClient);

  // Fetch all hosts
  getHosts(): Observable<HttpResponseInterface<Host[]>> {
    return this.http.get<HttpResponseInterface<Host[]>>(
      API_ENDPOINTS.ALL_HOSTS
    );
  }

  // Fetch a single host by ID
  getHostById(id: string): Observable<HttpResponseInterface<Host>> {
    const endpoint = `${API_ENDPOINTS.VIEW_HOST}/${id}`;
    return this.http.get<HttpResponseInterface<Host>>(endpoint);
  }

  // Add a new host
  addHost(host: Host): Observable<HttpResponseInterface<Host>> {
    return this.http.post<HttpResponseInterface<Host>>(
      API_ENDPOINTS.CREATE_HOST,
      host
    );
  }

  // Approve a host
  approveHost(
    id: string,
    payload: Host
  ): Observable<HttpResponseInterface<Host>> {
    const endpoint = `${API_ENDPOINTS.APPROVE_HOST}/${id}`;
    return this.http.put<HttpResponseInterface<Host>>(endpoint, payload);
  }

  // Delete a host
  deleteHost(id: number): Observable<HttpResponseInterface<null>> {
    const endpoint = `${API_ENDPOINTS.DELETE_HOST}/${id}`;
    return this.http.delete<HttpResponseInterface<null>>(endpoint);
  }
}
