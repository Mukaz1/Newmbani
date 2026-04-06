import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  AfterViewInit,
  signal,
} from '@angular/core';
import {
  PaginatedData,
  Landlord,
  HttpResponseInterface,
  LandlordApprovalStatus,
} from '@newmbani/types';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../../../common/components/search-input-widget/search-input-widget';
import { CsvExportService } from '../../../../../common/services/csv-export.service';
import { MetaService } from '../../../../../common/services/meta.service';
import saveAs from 'file-saver';
import { DropdownMenu } from '../../../../../common/components/dropdown-menu/dropdown-menu';
import { LandlordsService } from '../../../../../landlords/services/landlords.service';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-landlords',
  standalone: true,
  imports: [
    DataLoading,
    DatePipe,
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    Pagination,
    SearchInputWidget,
    DropdownMenu,
  ],
  templateUrl: './landlords.html',
  styleUrl: './landlords.scss',
})
export class Landlords implements OnInit, AfterViewInit {
  landlords = signal<Landlord[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  filteredLandlords = signal<Landlord[]>([]);
  originalLandlords = signal<Landlord[]>([]);
  keyword = signal('');

  pageSize = signal(10);
  currentPage = signal(1);

  // Use FormGroup only for checkboxes/checkArray
  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;

  // All state except for the form is now signals
  selectedLandlords = signal<string[]>([]);
  destroy$ = new Subject();

  isLoading = signal(false);
  error = signal<string | null>(null);

  // Search, filter, pagination
  searchTerm = signal('');
  statusFilter = signal<'all' | 'pending' | 'approved' | 'rejected'>('all');
  totalLandlords = signal(0);

  // Modal state
  showModal = signal(false);
  selectedLandlord = signal<Landlord | null>(null);

  LandlordStatus = LandlordApprovalStatus;
  // Inject dependencies
  private readonly landlordService = inject(LandlordsService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);
  private readonly metaService = inject(MetaService);
  private readonly csvExportService = inject(CsvExportService);

  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Landlords',
            isClickable: false,
          },
        ],
      },
      title: 'Landlords',
      description: 'Landlords',
    });

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((p: Params) => {
        this.navigateToNextPage(p);
      });

    // Only the form remains as a form
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.fetchLandlords();
    });
  }

  fetchLandlords() {
    this.isLoading.set(true);
    this.error.set(null);
    this.landlordService
      .getAllLandlords({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.searchTerm() || '',
      })
      .subscribe({
        next: (res: any) => {
          const data =
            (res as HttpResponseInterface<PaginatedData<Landlord[]>>)?.data
              ?.data || [];
          this.totalLandlords.set(res?.data?.total || data.length);

          this.landlords.set(data);
          this.isLoading.set(false);

          // Invalidate selected if new landlords loaded
          this.selectedLandlords.set([]);
          const checkArray = this.form.get('checkArray') as FormArray;
          checkArray.clear();
        },
        error: (err) => {
          this.error.set(
            err?.error?.message || err.message || 'Failed to load landlords.',
          );
          this.isLoading.set(false);
        },
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;
    const isChecked = (e.target as HTMLInputElement).checked;
    const landlords = this.landlords();
    const formValues = this.form.value.checkArray;

    if (isChecked && landlords) {
      landlords.forEach((landlord) => {
        const landlordId = landlord._id ?? landlord._id;
        const idAlreadyExists = formValues.includes(landlordId);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(landlordId));
        }
      });
    } else {
      checkArray.clear();
    }
    this.getSelectedLandlords();
  }

  onCheckboxChange(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;
    const targetValue = (e.target as HTMLInputElement).value;
    const isChecked = (e.target as HTMLInputElement).checked;

    if (isChecked) {
      checkArray.push(new FormControl(targetValue));
    } else {
      const index = checkArray.controls.findIndex(
        (control) => control.value === targetValue,
      );
      if (index !== -1) {
        checkArray.removeAt(index);
      }
    }
    this.checkIfAllIsSelected();
    this.getSelectedLandlords();
  }

  getSelectedLandlords() {
    this.selectedLandlords.set(this.form.value.checkArray);
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    if (
      this.landlords() &&
      this.landlords().length === this.form.value.checkArray.length
    ) {
      this.selectAll.nativeElement.checked = true;
    } else {
      this.selectAll.nativeElement.checked = false;
    }
  }

  isChecked(id: string): boolean {
    const values = this.form.value.checkArray;
    return values.find((value: string) => value === id);
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.fetchLandlords();
  }

  ngAfterViewInit(): void {
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (event: Event) => {
      const inputValue = (event.target as HTMLInputElement).value;
      if (inputValue.length === 0) {
        this.search();
      }
    });
  }

  updateKeyword(keyword: string) {
    this.keyword.set(keyword);
  }

  search() {
    this.onPageChange();
  }

  changePageSize(pageSize: number) {
    if (pageSize !== this.pageSize()) {
      this.pageSize.set(+pageSize);
      this.currentPage.set(1);
      this.changeDetectorRef.detectChanges();
      this.navigateToNextPage({});
    }
  }

  pageChange(page: number) {
    this.currentPage.set(page);
    this.changeDetectorRef.detectChanges();
    this.onPageChange();
  }

  navigateToNextPage(p: Params) {
    let params = p['params'];
    if (Object.keys(params).length) {
      const page = +params.page || 1;
      const limit = +params.limit || 10;
      const keyword = params.keyword || '';

      this.keyword.set(keyword);
      this.currentPage.set(page === 0 ? 1 : page);
      this.pageSize.set(limit === 0 && limit < 0 ? 10 : limit);
    } else {
      params = this.prepareQueryParams();
      this.router.navigateByUrl(`/admin/landlords?${params}`);
    }
  }

  prepareQueryParams(): string {
    const payload = {
      page: this.currentPage(),
      limit: this.pageSize(),
      keyword: this.keyword().length ? this.keyword() : '',
    };

    // prepare the params
    return (Object.keys(payload) as Array<keyof typeof payload>)
      .filter((key) => payload[key])
      .map((key) => [key, payload[key]].map(encodeURIComponent).join('='))
      .join('&');
  }

  onPageChange(): void {
    const params = this.prepareQueryParams();
    this.router.navigateByUrl(`/admin/landlords?${params}`);
  }

  printStatement = () => {
    console.log('Printing...');
  };

  /**
   * Exports data to csv
   *
   * @return {*}  {Promise<void>}
   * @memberof AllLandlords
   */
  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.landlords().map((emp) => {
      const entry = {
        name: emp.name,
        Status: emp.country,
        Phone: emp.phone,
        Email: emp.email,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `Landlords_List_${timestamp}.csv`);
  }

  onFilter(status: 'all' | 'pending' | 'approved' | 'rejected') {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.fetchLandlords();
  }

  get totalPages() {
    return Math.ceil(this.totalLandlords() / this.pageSize()) || 1;
  }

  // Modal logic
  openModal(landlord: Landlord) {
    this.selectedLandlord.set(landlord);
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.selectedLandlord.set(null);
  }

  // Approve/Reject logic (to be implemented)
  approveLandlord(landlord: Landlord) {
    //
  }
  rejectLandlord(landlord: Landlord) {
    //
  }

  viewLandlord(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
