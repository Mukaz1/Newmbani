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
import { PaginatedData, Host } from '@newmbani/types';
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
import { HostsService } from '../../../../../landlords/services/hosts.service';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-hosts',
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
  templateUrl: './hosts.html',
  styleUrl: './hosts.scss',
})
export class Hosts implements OnInit, AfterViewInit {
  hosts = signal<Host[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  filteredHosts = signal<Host[]>([]);
  originalHosts = signal<Host[]>([]);
  keyword = signal('');

  pageSize = signal(10);
  currentPage = signal(1);

  // Use FormGroup only for checkboxes/checkArray
  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;

  // All state except for the form is now signals
  selectedHosts = signal<string[]>([]);
  destroy$ = new Subject();

  isLoading = signal(false);
  error = signal<string | null>(null);

  // Search, filter, pagination
  searchTerm = signal('');
  statusFilter = signal<'all' | 'pending' | 'approved' | 'rejected'>('all');
  totalHosts = signal(0);

  // Modal state
  showModal = signal(false);
  selectedHost = signal<Host | null>(null);

  // Inject dependencies
  private readonly hostService = inject(HostsService);
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
            linkTitle: 'Hosts',
            isClickable: false,
          },
        ],
      },
      title: 'Hosts',
      description: 'Hosts',
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
      this.fetchHosts();
    });
  }

  fetchHosts() {
    this.isLoading.set(true);
    this.error.set(null);
    this.hostService
      .getAllHosts({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (res: any) => {
          const data = res?.data?.data || [];
          this.totalHosts.set(res?.data?.total || data.length);
          let hosts = data.map((v: any) => ({
            id: v._id || v.id,
            name: v.name || v.name || 'N/A',
            email: v.email || v.email || 'N/A',
            status: v.status || 'pending',
            createdAt: v.createdAt ? v.createdAt.slice(0, 10) : '',
            ...v,
          }));
          if (this.statusFilter() !== 'all') {
            hosts = hosts.filter((v: Host) => v.verified);
          }
          this.hosts.set(hosts);
          this.isLoading.set(false);

          // Invalidate selected if new hosts loaded
          this.selectedHosts.set([]);
          const checkArray = this.form.get('checkArray') as FormArray;
          checkArray.clear();
        },
        error: (err) => {
          this.error.set(
            err?.error?.message || err.message || 'Failed to load hosts.'
          );
          this.isLoading.set(false);
        },
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;
    const isChecked = (e.target as HTMLInputElement).checked;
    const hosts = this.hosts();
    const formValues = this.form.value.checkArray;

    if (isChecked && hosts) {
      hosts.forEach((host) => {
        const hostId = host._id ?? host._id;
        const idAlreadyExists = formValues.includes(hostId);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(hostId));
        }
      });
    } else {
      checkArray.clear();
    }
    this.getSelectedHosts();
  }

  onCheckboxChange(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;
    const targetValue = (e.target as HTMLInputElement).value;
    const isChecked = (e.target as HTMLInputElement).checked;

    if (isChecked) {
      checkArray.push(new FormControl(targetValue));
    } else {
      const index = checkArray.controls.findIndex(
        (control) => control.value === targetValue
      );
      if (index !== -1) {
        checkArray.removeAt(index);
      }
    }
    this.checkIfAllIsSelected();
    this.getSelectedHosts();
  }

  getSelectedHosts() {
    this.selectedHosts.set(this.form.value.checkArray);
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    if (
      this.hosts() &&
      this.hosts().length === this.form.value.checkArray.length
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
    this.fetchHosts();
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
      this.router.navigateByUrl(`/admin/hosts?${params}`);
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
    this.router.navigateByUrl(`/admin/hosts?${params}`);
  }

  printStatement = () => {
    console.log('Printing...');
  };

  /**
   * Exports data to csv
   *
   * @return {*}  {Promise<void>}
   * @memberof AllHosts
   */
  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.hosts().map((emp) => {
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
    saveAs(res, `Hosts_List_${timestamp}.csv`);
  }

  onFilter(status: 'all' | 'pending' | 'approved' | 'rejected') {
    this.statusFilter.set(status);
    this.currentPage.set(1);
    this.fetchHosts();
  }

  get totalPages() {
    return Math.ceil(this.totalHosts() / this.pageSize()) || 1;
  }

  // Modal logic
  openModal(host: Host) {
    this.selectedHost.set(host);
    this.showModal.set(true);
  }
  closeModal() {
    this.showModal.set(false);
    this.selectedHost.set(null);
  }

  // Approve/Reject logic (to be implemented)
  approveHost(host: Host) {
    //
  }
  rejectHost(host: Host) {
    //
  }

  viewHost(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }
}
