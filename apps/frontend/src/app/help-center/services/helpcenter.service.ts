import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HelpcenterService {
  getTopics(): Observable<any[]> {
    return of([]);
  }

  getSubTopics(topicId: string): Observable<any[]> {
    return of([]);
  }
}
