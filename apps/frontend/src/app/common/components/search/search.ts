import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { SearchListenerService } from '../../services/search-listener.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements AfterViewInit, OnChanges {
  private readonly router = inject(Router);
  private readonly searchListenerService = inject(SearchListenerService);

  readonly searchInputRef = viewChild.required<ElementRef>('searchInput');
  readonly keyword = input.required<string | null>();
  @Input({ required: true }) showInput = false;
  readonly fullSearchInput = input.required<boolean>();

  showSearchButton = false;
  isPropertiesPage = false;
  url: string | undefined = undefined;
  readonly searchTerm = output<string>();
  searchForm: FormGroup = new FormGroup({
    keyword: new FormControl(''),
  });
  destroy$ = new Subject();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['keyword']) {
      this.searchForm.patchValue({
        keyword: this.keyword(),
      });
    }
  }
  ngAfterViewInit(): void {
    const searchInputRef = this.searchInputRef();
    if (searchInputRef) {
      const ref: HTMLElement = searchInputRef.nativeElement;
      ref.addEventListener('focus', () => {
        this.showSearchButton = true;
        this.checkIfPropertiesPage();
      });
      ref.addEventListener('focusout', () => {
        this.showSearchButton = false;
      });
    }
  }

  toggleSearch() {
    this.showInput = !this.showInput;
    this.showSearchButton = true;
  }
  checkIfPropertiesPage() {
    const route: string = this.router.url;
    this.url = route;
    if (this.url && this.url.includes('/properties')) {
      this.isPropertiesPage = true;
    } else {
      this.isPropertiesPage = false;
    }
  }

  search() {
    const { keyword } = this.searchForm.value;
    this.searchTerm.emit(keyword);
    this.searchListenerService.updateSearchTerm(keyword);

    if (this.isPropertiesPage === false) {
      this.router.navigateByUrl(`/properties?keyword=${keyword}`);
    }
  }
}
