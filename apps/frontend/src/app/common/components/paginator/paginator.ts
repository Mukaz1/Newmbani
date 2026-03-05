import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator implements OnChanges {
  readonly currentPage = input.required<number>();
  @Input({ required: true }) pages = 1;
  readonly pageSize = input.required<number>();
  readonly total = input.required<number>();

  readonly previousPageEvent = output();
  readonly nextPageEvent = output();

  start = 0;
  end = 0;
  ngOnChanges(_changes: SimpleChanges): void {
    this.calculatePageDetails();
  }
  /**
   * Emit the previousPageEvent when the previous page button is clicked.
   */
  previousPage(): void {
    if (this.currentPage() > 0) {
      // TODO: The 'emit' function requires a mandatory any argument
      this.previousPageEvent.emit();
    }
    return;
  }

  /**
   * Emit the nextPageEvent when the next page button is clicked.
   */
  nextPage(): void {
    if (this.currentPage() < this.pages) {
      // TODO: The 'emit' function requires a mandatory any argument
      this.nextPageEvent.emit();
    }
    return;
  }

  calculatePageDetails() {
    const page = this.currentPage() - 1;
    this.pages = this.pages === 0 ? 1 : this.pages;
    const start = this.pageSize() * page;
    this.start =
      this.currentPage() === 1 ? (this.total() === 0 ? 0 : 1) : start + 1;
    const end = this.start + this.pageSize() - 1;

    this.end = end > this.total() ? this.total() : end;
  }
}
