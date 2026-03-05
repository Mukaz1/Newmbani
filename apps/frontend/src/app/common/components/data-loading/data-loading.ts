import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  input,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-data-loading',
  imports: [NgClass],
  templateUrl: './data-loading.html',
  styleUrl: './data-loading.scss',
})
export class DataLoading implements OnDestroy, OnChanges {
  @Input()
  message = `Please hang tight as we load the data for you.`;
  readonly fullPage = input(true);
  readonly styles = input('');
  readonly containerStyles = input('');
  destroy$ = new Subject();
  /**
   * Creates an instance of DataLoading.
   * @param {ChangeDetectorRef} changeDetectorRef
   * @memberof DataLoading
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message']) {
      this.message = changes['message'].currentValue || this.message;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
