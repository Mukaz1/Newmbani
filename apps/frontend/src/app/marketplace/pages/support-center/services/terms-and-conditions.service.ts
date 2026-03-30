import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../../common/routes.constants';
import { Observable } from 'rxjs';
import { HttpResponseInterface, Term } from '@newmbani/types';

@Injectable({
  providedIn: 'root',
})
export class TermsAndConditionsService {
   private httpClient: HttpClient = inject(HttpClient);

  getAllTerms() {
    return this.httpClient.get(API_ENDPOINTS.GET_TERMS);
  }

  getTermsByCategory(
    termsCategory: string
  ): Observable<HttpResponseInterface<Term | null>> {
    const endpoint = `${API_ENDPOINTS.GET_TERMS}/${termsCategory}`;
    return this.httpClient.get<HttpResponseInterface<Term | null>>(endpoint);
  }
}
