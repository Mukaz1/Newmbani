import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  // Minimal stub used to satisfy imports during build. Implement real HTTP calls later.
  createPayment(payload: any): Observable<any> {
    return of({ success: true, data: null });
  }

  getPayment(id: string): Observable<any> {
    return of(null);
  }
}
