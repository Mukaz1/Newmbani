import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CreateRole,
  HttpResponseInterface,
  PaginatedData,
  Permission,
  Role,
  UpdateRole,
  User,
} from '@newmbani/types';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private httpClient = inject(HttpClient);

  getAll() {
    return this.httpClient.get(API_ENDPOINTS.GET_ROLES);
  }

  getAllUsersWithARole(
    roleId: string
  ): Observable<HttpResponseInterface<PaginatedData<User | null>>> {
    const endpoint = `${API_ENDPOINTS.GET_USERS_WITH_ROLE}/${roleId}`;
    return this.httpClient.get<
      HttpResponseInterface<PaginatedData<User | null>>
    >(endpoint);
  }

  addRole(payload: CreateRole): Observable<HttpResponseInterface<Role | null>> {
    return this.httpClient.post<HttpResponseInterface<Role>>(
      API_ENDPOINTS.CREATE_ROLE,
      payload
    );
  }

  updateRole(
    roleId: string,
    payload: UpdateRole
  ): Observable<HttpResponseInterface<Role | null>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_ROLE}/${roleId}`;
    return this.httpClient.patch<HttpResponseInterface<Role | null>>(
      endpoint,
      payload
    );
  }

  getRoleById(roleId: string): Observable<HttpResponseInterface<Role | null>> {
    const endpoint = `${API_ENDPOINTS.GET_ROLE}/${roleId}`;
    return this.httpClient.get<HttpResponseInterface<Role | null>>(endpoint);
  }

  getPermissions(): Observable<HttpResponseInterface<Permission[]>> {
    const endpoint = `${API_ENDPOINTS.GET_PERMISSIONS}`;
    return this.httpClient.get<HttpResponseInterface<Permission[]>>(endpoint);
  }
}
