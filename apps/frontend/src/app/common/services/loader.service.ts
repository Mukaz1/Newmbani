import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private message = new Subject<string>();
  message$ = this.message.asObservable();
  constructor() {}

  setLoaderMessage(notification: string): void {
    this.message.next(notification);
    return;
  }
}
