import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchListenerService {
  private searchTerm = new Subject<string | undefined>();
  searchTerm$ = this.searchTerm.asObservable();

  updateSearchTerm(keyword?: string): void {
    this.searchTerm.next(keyword);
  }
}
