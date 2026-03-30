import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@newmbani/shared';
import { Property , IResponse} from '@newmbani/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private http = inject(HttpClient)
  create(data: c): Observable<IResponse<Property>> {
    return this.http.post<IResponse<Property>>(API_ENDPOINTS.CREATE_PROPERTY, data);
  }


}


