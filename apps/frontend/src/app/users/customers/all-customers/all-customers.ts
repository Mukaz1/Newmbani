import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { RouterLink, Router, ActivatedRoute, Params } from '@angular/router';
import saveAs from 'file-saver';
import {
  Customer,
  PaginatedData,
  Role,
  HttpResponseInterface,
} from '@newmbani/types';
import { Subject, takeUntil } from 'rxjs';
import { CsvExportService } from '../../../common/services/csv-export.service';
import { MetaService } from '../../../common/services/meta.service';
import { UsersService } from '../../../admin/services/users.service';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { DropdownMenu } from '../../../common/components/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.html',
  styleUrls: ['./all-customers.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    RouterLink,
    Pagination,
    SearchInputWidget,
    DropdownMenu,
  ],
})
export class AllCustomers implements OnInit, OnDestroy, AfterViewInit {
  customers: Customer[] = [];
  paginatedData: PaginatedData | undefined;
  filteredCustomers: Customer[] = [];
  originalCustomers: Customer[] = [];
  roles: Role[] = [];
  keyword = '';
  loading = true;

  pageSize = 10;
  currentPage = 1;
  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;
  selectedCustomers: string[] = [];
  destroy$ = new Subject();

  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);
  private readonly usersService = inject(UsersService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly csvExportService = inject(CsvExportService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Customers',
            isClickable: false,
          },
        ],
      },
      title: 'Customers',
      description: 'All Customers',
    });

    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((p: Params) => {
        this.navigateToNextPage(p);
      });

    // Initialize the form
    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
    });
  }

  ngOnInit(): void {
    // On page change
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getCustomers();
    });
  }

  getCustomers() {
    this.paginatedData = undefined;
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    this.usersService
      .findAllCustomers({
        limit: this.pageSize,
        page: this.currentPage,
        keyword: this.keyword,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponseInterface) => {
          const res: HttpResponseInterface = response;
          const data: PaginatedData | undefined = res.data as PaginatedData;
          if (data) {
            this.paginatedData = data;
            this.customers = data.data;
            this.loading = false;
            this.changePageSize(this.pageSize);
            this.changeDetectorRef.detectChanges();
          }
        },
        error: () => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;

    const isChecked = (e.target as HTMLInputElement).checked;
    const customers = this.customers;
    const formValues = this.form.value.checkArray;

    if (isChecked && customers) {
      customers.forEach((customer) => {
        const idAlreadyExists = formValues.includes(customer._id);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(customer._id));
        }
      });
    } else {
      checkArray.clear();
    }

    this.getSelectedCustomers();
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
    // check whether all are still selected
    this.checkIfAllIsSelected();
    this.getSelectedCustomers();
  }

  getSelectedCustomers() {
    this.selectedCustomers = this.form.value.checkArray;
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    if (
      this.customers &&
      this.customers.length === this.form.value.checkArray.length
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

  addNewCustomer() {
    this.router.navigate(['/admin/customers/create']);
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
    this.keyword = keyword;
  }

  search() {
    this.onPageChange();
  }
  changePageSize(pageSize: number) {
    if (pageSize !== this.pageSize) {
      this.pageSize = +pageSize;
      this.currentPage = 1;
      this.changeDetectorRef.detectChanges();
      this.navigateToNextPage({});
    }
  }

  pageChange(page: number) {
    this.currentPage = page;
    this.changeDetectorRef.detectChanges();
    this.onPageChange();
  }

  navigateToNextPage(p: Params) {
    let params = p['params'];
    if (Object.keys(params).length) {
      const page = +params.page || 1;
      const limit = +params.limit || 10;
      const keyword = params.keyword || '';

      this.keyword = keyword;
      this.currentPage = page === 0 ? 1 : page;
      this.pageSize = limit === 0 && limit < 0 ? 10 : limit;
    } else {
      params = this.prepareQueryParams();
      this.router.navigateByUrl(`/admin/customers?${params}`);
    }
  }

  prepareQueryParams(): string {
    const payload = {
      page: this.currentPage,
      limit: this.pageSize,
      keyword: this.keyword.length ? this.keyword : '',
    };

    // prepare the params
    return (Object.keys(payload) as Array<keyof typeof payload>)
      .filter((key) => payload[key])
      .map((key) => [key, payload[key]].map(encodeURIComponent).join('='))
      .join('&');
  }

  onPageChange(): void {
    const params = this.prepareQueryParams();
    this.router.navigateByUrl(`/admin/customers?${params}`);
  }

  printStatement = () => {
    console.log('Printing...');
  };

  /**
   * Exports data to csv
   *
   * @return {*}  {Promise<void>}
   * @memberof AllCustomerComponent
   */
  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.customers.map((emp) => {
      const entry = {
        Name: emp.name,
        Phone: emp.phone,
        Email: emp.email,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `Customer_List_${timestamp}.csv`);
  }

  viewCustomer(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editCustomer(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }
  // delete() {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
