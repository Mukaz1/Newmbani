import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  // Minimal stub for dev: replace with real HTTP interactions.
  getBooking(id: string): Observable<any> {
    return of(null);
  }
}
