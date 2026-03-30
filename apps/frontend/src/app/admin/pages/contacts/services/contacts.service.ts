import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contact, HttpResponseInterface, PaginatedData } from '@newmbani/types';
import { API_ENDPOINTS } from '../../../../common/routes.constants';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private httpClient = inject(HttpClient);

  sortContactsByName(groups: Contact[]): Contact[] {
    const arrayForSort = [...groups];
    const newArray = arrayForSort.sort((a, b) => {
      const nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
      const nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
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

  getAllContacts() {
    return this.httpClient.get(API_ENDPOINTS.VIEW_CONTACT_MESSAGES);
  }

    getAll(data?: {
      limit?: number;
      page?: number;
      keyword?: string;
    }): Observable<HttpResponseInterface<PaginatedData<Contact[]>>> {
      const options = data
        ? {
            params: new HttpParams()
              .set('limit', data.limit?.toString() ?? '')
              .set('page', data.page?.toString() ?? '')
              .set('keyword', data.keyword ?? ''),
          }
        : {};
      return this.httpClient.get<
        HttpResponseInterface<PaginatedData<Contact[]>>
      >(API_ENDPOINTS.VIEW_CONTACT_MESSAGES, options);
    }

  // getAll(data?: { limit: number; page: number; keyword: string }) {
  //   try {
  //     const options = data
  //       ? {
  //           params: new HttpParams()
  //             .set('limit', data.limit)
  //             .set('page', data.page)
  //             .set('keyword', data.keyword ? data.keyword : ''),
  //         }
  //       : {};
  //     return this.httpClient.get(API_ENDPOINTS.VIEW_CONTACT_MESSAGES, options);
  //   } catch (error) {
  //     return of(error);
  //   }
  // }

  getContactById(contactId: string) {
    try {
      const endpoint = `${API_ENDPOINTS.VIEW_CONTACT_MESSAGE}/${contactId}`;
      return this.httpClient.get(endpoint);
    } catch (error) {
      return of(error);
    }
  }

  deleteMessage(contactId: string) {
    try {
      const endpoint = `${API_ENDPOINTS.VIEW_CONTACT_MESSAGE}/${contactId}`;
      return this.httpClient.delete(endpoint);
    } catch (error) {
      return of(error);
    }
  }
}
