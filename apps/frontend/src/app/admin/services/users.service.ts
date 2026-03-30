import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../common/routes.constants';
import {
  Employee,
  HttpResponseInterface,
  RegisterEmployee,
  UpdateEmployee,
  UpdateUser,
  User,
  UpdateCustomer,
  RegisterCustomer,
} from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
 private httpClient: HttpClient = inject(HttpClient);

  // Fetch all users-old
  findAll(): Observable<HttpResponseInterface<User[]>> {
    return this.httpClient.get<HttpResponseInterface<User[]>>(
      API_ENDPOINTS.GET_USERS
    );
  }

  addNewCustomer(payload: RegisterCustomer): Observable<HttpResponseInterface> {
    const endpoint =API_ENDPOINTS.CREATE_CUSTOMER;
    return this.httpClient.post<HttpResponseInterface>(endpoint, payload);
  }

  findAllCustomers(data?: {
    limit: number;
    page: number;
    keyword: string;
  }): Observable<HttpResponseInterface> {
    const endpoint = API_ENDPOINTS.GET_CUSTOMERS;
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

  // Fetch a single customer by ID
  getCustomerById(userID: string) {
    const endpoint = API_ENDPOINTS.GET_CUSTOMER(userID);
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  editCustomer(customerId: string, payload: UpdateCustomer) {
    let endpoint = `${API_ENDPOINTS.UPDATE_CUSTOMER}`;
    endpoint = `${endpoint}/${customerId}`;
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }

  // Fetch a single user by ID
  findById(id: string): Observable<HttpResponseInterface<User>> {
    const endpoint = API_ENDPOINTS.GET_USER(id);
    return this.httpClient.get<HttpResponseInterface<User>>(endpoint);
  }

  // Add a new user
  addUser(user: User): Observable<HttpResponseInterface<User>> {
    return this.httpClient.post<HttpResponseInterface<User>>(
      API_ENDPOINTS.CREATE_USER,
      user
    );
  }

  // Update an existing user
  updateUser(
    id: string,
    payload: User
  ): Observable<HttpResponseInterface<User>> {
    const endpoint = API_ENDPOINTS.UPDATE_USER(id);
    return this.httpClient.put<HttpResponseInterface<User>>(endpoint, payload);
  }

  // Delete a user
  deleteUser(id: string): Observable<HttpResponseInterface<null>> {
    const endpoint = API_ENDPOINTS.DELETE_USER(id);
    return this.httpClient.delete<HttpResponseInterface<null>>(endpoint);
  }

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
    const endpoint = API_ENDPOINTS.GET_EMPLOYEES;
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
    const endpoint =API_ENDPOINTS.GET_EMPLOYEES;
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
    const endpoint = API_ENDPOINTS.GET_USER(userID);
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  getEmployeeById(employeeId: string) {
    const endpoint = API_ENDPOINTS.GET_EMPLOYEE_BY_ID(employeeId);
    return this.httpClient.get<HttpResponseInterface>(endpoint);
  }

  editEmployee(employeeId: string, payload: UpdateEmployee) {
    const endpoint =API_ENDPOINTS.UPDATE_EMPLOYEE(employeeId);
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }

  editProfile(userId: string, payload: UpdateUser) {
    let endpoint = API_ENDPOINTS.UPDATE_USER(userId);
    return this.httpClient.patch<HttpResponseInterface>(endpoint, payload);
  }
}
