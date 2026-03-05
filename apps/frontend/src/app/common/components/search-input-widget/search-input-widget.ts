import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search-input-widget',
  templateUrl: './search-input-widget.html',
  styleUrls: ['./search-input-widget.scss'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class SearchInputWidget
  implements OnInit, OnDestroy, OnChanges
{
  @Input({ required: true }) keyword = '';
  @Input({ required: true }) enableAdvancedSearch = false;
  @Input() placeholder = 'Search';
  @Output() keywordChangedEvent = new EventEmitter<string>();
  @Output() searchButtonClickedEvent = new EventEmitter<string>();
  @Output() advancedSearchClicked = new EventEmitter<void>();
  form: FormGroup = new FormGroup({
    keyword: new FormControl({}),
  });
  destroy$ = new Subject();

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe((data) => {
        const { keyword } = data;
        const length = keyword.length;
        this.keyword = keyword;
        // emit the search text
        this.keywordChangedEvent.emit(keyword);
        if (length === 0) {
          this.searchButtonClicked();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['keyword']) {
      const curerentText = changes['keyword'].currentValue;
      const { keyword } = this.form.value;
      // patch the form if the current search text value is the not the same
      if (curerentText !== keyword) {
        this.form.patchValue({
          keyword: curerentText,
        });
      }
    }
  }

  /**
   * Emit the current search text to the parent component when the search button is clicked.
   *
   * @returns An observable that emits the current search text when the search button is clicked.
   */
  searchButtonClicked() {
    return this.searchButtonClickedEvent.emit(this.keyword);
  }

  advancedSearch() {
    return this.advancedSearchClicked.emit();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
