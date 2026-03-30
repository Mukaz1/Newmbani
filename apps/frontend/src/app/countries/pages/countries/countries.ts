import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NotificationStatusEnum, Country, PaginatedData, HttpResponseInterface } from '@newmbani/types';
import { NotificationService } from '../../../common/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '../../../common/services/meta.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInput } from '../../../marketplace/components/search-input/search-input';
import { Dialog } from '@angular/cdk/dialog';
import { ViewCountry } from '../view-country/view-country';
import { CountriesService } from '../../services/countries.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-countries',
  imports: [NgClass, DataLoading, Pagination, SearchInput],
  templateUrl: './countries.html',
  styleUrl: './countries.scss',
})
export class Countries implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);
  countries = signal<Country[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  selectedCountries = signal<string[]>([]);
  allSelected = signal(false);
  viewMode = signal<'supported' | 'notSupported' | 'all'>('supported');

  changeViewMode(mode: 'supported' | 'notSupported' | 'all') {
    this.viewMode.set(mode);
    this.currentPage.set(1);
    this.fetchCountries();
  }

  private readonly countriesService = inject(CountriesService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private metaService = inject(MetaService);
  private readonly dialog = inject(Dialog);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Countries',
            isClickable: false,
          },
        ],
      },
      title: 'Countries',
      description: 'Countries',
    });
  }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param:any) => {
        const isEmpty = param.keys.length === 0;
        if (isEmpty) {
          this.patchQueryParams();
        } else {
          const page = param.get('page') || this.currentPage().toString();
          const pageSize = param.get('limit') || this.pageSize().toString();
          const keyword = param.get('keyword') || this.keyword();

          this.currentPage.set(+page);
          this.pageSize.set(+pageSize);
          this.keyword.set(keyword);

          this.fetchCountries();
        }
      });
  }

  patchQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage(),
        keyword: this.keyword(),
        limit: this.pageSize(),
      },
      queryParamsHandling: 'merge',
    });
  }

  fetchCountries() {
    this.isLoading.set(true);
    this.error.set(null);

    const params: any = {
      page: this.currentPage(),
      limit: this.pageSize(),
      keyword: this.keyword(),
    };
    if (this.viewMode() === 'supported') {
      params.supported = 'true';
    } else if (this.viewMode() === 'notSupported') {
      params.supported = 'false';
    }
    // If 'all', we don't add supported flag
    this.countriesService
      .getCountries(params)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res)=> {
          const response = res as HttpResponseInterface<PaginatedData<Country[]>>
          this.countries.set(response.data.data);
          this.paginatedData.set(response.data);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load countries. Please try again.');
          this.countries.set([]);
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: 'Failed to load countries. Please try again.',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  onSearchTermChange(value: string) {
    this.keyword.set(value);
    this.currentPage.set(1);
    this.patchQueryParams();
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.patchQueryParams();
  }

  handlePageSizeChange(pageSize: number) {
    this.pageSize.set(pageSize);
    this.currentPage.set(1); // Reset to first page when changing page size
    this.patchQueryParams();
  }

  selectAll(event: any) {
    const value: boolean = event.target.checked as boolean;
    this.allSelected.set(value);

    if (value) {
      // Select all countries on current page
      const allIds = this.countries().map((country) => country._id);
      this.selectedCountries.set(allIds);
    } else {
      // Deselect all
      this.selectedCountries.set([]);
    }
  }

  selectCountry(event: any, countryId: string) {
    const value: boolean = event.target.checked as boolean;
    const currentSelected = this.selectedCountries();

    if (value) {
      // Add country to selection
      this.selectedCountries.set([...currentSelected, countryId]);
    } else {
      // Remove country from selection
      this.selectedCountries.set(
        currentSelected.filter((id) => id !== countryId)
      );
    }

    // Update allSelected based on whether all countries are selected
    const allCurrentPageSelected = this.countries().every((country) =>
      this.selectedCountries().includes(country._id)
    );
    this.allSelected.set(allCurrentPageSelected);
  }

  isChecked(id: string): boolean {
    return this.selectedCountries().includes(id);
  }

  async viewCountry(country: Country) {
    const modalRef = this.dialog.open(ViewCountry, {
      data: country,
      disableClose: true,
    });
    modalRef.closed.subscribe(() => {
      this.fetchCountries();
    });
  }
}
