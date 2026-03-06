import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Employee,
  HttpResponseInterface,
  RegisterEmployee,
  UpdateEmployee,
  PaginatedData,
} from '@newmbani/types';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  http = inject(HttpClient);

  // Fetch all employees with pagination
  getEmployees(data?: {
    limit: number;
    page: number;
    keyword: string;
  }): Observable<HttpResponseInterface<PaginatedData<Employee[]>>> {
    const endpoint = `${API_ENDPOINTS.VIEW_EMPLOYEES}`;
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('keyword', data.keyword ?? ''),
        }
      : {};
    return this.http.get<HttpResponseInterface<PaginatedData<Employee[]>>>(
      endpoint,
      options
    );
  }

  // Fetch a single employee by ID
  getEmployeeById(id: string): Observable<HttpResponseInterface<Employee>> {
    const endpoint = `${API_ENDPOINTS.VIEW_EMPLOYEE}/${id}`;
    return this.http.get<HttpResponseInterface<Employee>>(endpoint);
  }

  // Add a new employee
  addEmployee(
    payload: RegisterEmployee
  ): Observable<HttpResponseInterface<Employee>> {
    return this.http.post<HttpResponseInterface<Employee>>(
      API_ENDPOINTS.CREATE_EMPLOYEE,
      payload
    );
  }

  // Update an existing employee
  updateEmployee(
    id: string,
    payload: UpdateEmployee
  ): Observable<HttpResponseInterface<Employee>> {
    const endpoint = `${API_ENDPOINTS.UPDATE_EMPLOYEE}/${id}`;
    return this.http.patch<HttpResponseInterface<Employee>>(endpoint, payload);
  }

  // Delete an employee
  deleteEmployee(id: string): Observable<HttpResponseInterface<null>> {
    const endpoint = `${API_ENDPOINTS.DELETE_EMPLOYEE}/${id}`;
    return this.http.delete<HttpResponseInterface<null>>(endpoint);
  }
}
