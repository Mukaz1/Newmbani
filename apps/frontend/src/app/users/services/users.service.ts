import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Employee,
  HttpResponseInterface,
  RegisterEmployee,
  UpdateEmployee,
  UpdateUser,
  User,
} from '@newmbani/types';
import { API_ENDPOINTS } from '../../common/routes.constants';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
 private http: HttpClient = inject(HttpClient);

  sortEmployeesByName(groups: Employee[]): Employee[] {
    const arrayForSort = [...groups];
    const newArray = arrayForSort.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
    return newArray;
  }

  getAllEmployees(): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.VIEW_EMPLOYEES}`;
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  /**
   * Gets all employees. If data is provided, it will be used for pagination
   * and search. If data is not provided, it will return all employees.
   *
   * @param data - The data to use for pagination and search. If not provided,
   * it will return all employees. The data should have the following properties:
   * - limit: The number of employees to return per page.
   * - page: The page number to return.
   * - keyword: The keyword to search for.
   * @returns An observable with the response from the server.
   */
  getAll(data?: {
    limit: number;
    page: number;
    keyword: string;
  }): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.VIEW_EMPLOYEES}`;
    const options = data
      ? {
          params: new HttpParams()
            .set('limit', data.limit)
            .set('page', data.page)
            .set('keyword', data.keyword ? data.keyword : ''),
        }
      : {};
    return this.httpClient.get<HttpResponseInterface>(endpoint, options);
  }

  addNewEmployee(payload: RegisterEmployee): Observable<HttpResponseInterface> {
    const endpoint = `${API_ENDPOINTS.CREATE_EMPLOYEE}`;
    return this.httpClient.post<HttpResponseInterface>(endpoint, payload);
  }

  getUserById(userID: string) {
    let endpoint = `${API_ENDPOINTS.VIEW_USER}`;
    endpoint = `${endpoint}/${userID}`;
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  getEmployeeById(employeeId: string) {
    let endpoint = `${API_ENDPOINTS.GET_EMPLOYEE_BY_ID}`;
    endpoint = `${endpoint}/${employeeId}`;
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  editEmployee(employeeId: string, payload: UpdateEmployee) {
    let endpoint = `${API_ENDPOINTS.UPDATE_EMPLOYEE}`;
    endpoint = `${endpoint}/${employeeId}`;
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }
  updateUser(userId: string, payload: Partial<User>) {
    let endpoint = `${API_ENDPOINTS.UPDATE_USER}`;
    endpoint = `${endpoint}/${userId}`;
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }

  editProfile(userId: string, payload: UpdateUser) {
    let endpoint = `${API_ENDPOINTS.UPDATE_USER}`;
    endpoint = `${endpoint}/${userId}`;
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }
}
