import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Breadcrumb } from '../components/breadcrumb/breadcrumb';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumb = new BehaviorSubject<Breadcrumb | null>(null);
  breadcrumb$ = this.breadcrumb.asObservable();

  /**
   * Set breadcrumb
   *
   * @param {Breadcrumb} breadcrumb
   * @return {*}  {void}
   * @memberof BreadcrumbService
   */
  setBreadcrumb(breadcrumb: Breadcrumb): void {
    this.breadcrumb.next(breadcrumb);
    return;
  }
}
