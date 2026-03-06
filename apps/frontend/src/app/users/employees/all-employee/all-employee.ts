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
import { CsvExportService } from '../../../common/services/csv-export.service';
import { MetaService } from '../../../common/services/meta.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { EmployeesService } from '../../../admin/services/employees.service';
import {
  Employee,
  PaginatedData,
  Role,
  HttpResponseInterface,
} from '@newmbani/types';
import { Subject, takeUntil } from 'rxjs';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { RolesService } from '../../../admin/pages/roles/services/roles.service';
import { DropdownMenu } from '../../../common/components/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-all-employee',
  templateUrl: './all-employee.html',
  styleUrls: ['./all-employee.scss'],
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
export class AllEmployee implements OnInit, OnDestroy, AfterViewInit {
  employees: Employee[] = [];
  paginatedData: PaginatedData | undefined;
  filteredEmployees: Employee[] = [];
  originalEmployees: Employee[] = [];
  roles: Role[] = [];
  keyword = '';
  loading = true;

  // map roleId to role name for quick lookups when listing employees
  private roleIdToNameMap: Map<string, string> = new Map<string, string>();

  pageSize = 10;
  currentPage = 1;
  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;
  selectedEmployees: string[] = [];
  destroy$ = new Subject();

  private readonly router = inject(Router);
  private readonly metaService = inject(MetaService);
  private readonly employeesService = inject(EmployeesService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly rolesService = inject(RolesService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly csvExportService = inject(CsvExportService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Employees',
            isClickable: false,
          },
        ],
      },
      title: 'Employees',
      description: 'Employees',
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
    // Load roles so we can map roleId to role name in the table
    this.rolesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.roles = res.data;
          // build the lookup map
          this.roleIdToNameMap = new Map(
            (this.roles || []).map((r: Role) => [r._id, r.name ?? ''])
          );
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          // keep the map empty; UI will show fallback
        },
      });

    // On page change
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getEmployees();
    });
  }

  // Resolve a role name from a roleId safely
  getRoleNameById(roleId?: string): string {
    if (!roleId) return 'N/A';
    return this.roleIdToNameMap.get(roleId) || 'N/A';
  }

  getEmployees() {
    this.paginatedData = undefined;
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    this.employeesService
      .getEmployees({
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
            this.employees = data.data;

            this.loading = false;
            this.changePageSize(this.pageSize);
            this.changeDetectorRef.detectChanges();
          }
        },
        error: (error) => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
          console.error('Error fetching employees:', error);
        },
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;

    const isChecked = (e.target as HTMLInputElement).checked;
    const employees = this.employees;
    const formValues = this.form.value.checkArray;

    if (isChecked && employees) {
      employees.forEach((employee) => {
        const idAlreadyExists = formValues.includes(employee._id);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(employee._id));
        }
      });
    } else {
      checkArray.clear();
    }

    this.getSelectedEmployees();
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
    this.getSelectedEmployees();
  }

  getSelectedEmployees() {
    this.selectedEmployees = this.form.value.checkArray;
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    if (
      this.employees &&
      this.employees.length === this.form.value.checkArray.length
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

  addNewEmployee() {
    this.router.navigate(['/admin/employees/create']);
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
      this.router.navigateByUrl(`/admin/employees?${params}`);
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
    this.router.navigateByUrl(`/admin/employees?${params}`);
  }

  printStatement = () => {
    console.log('Printing...');
  };

  /**
   * Exports data to csv
   *
   * @return {*}  {Promise<void>}
   * @memberof AllEmployee
   */
  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.employees.map((emp) => {
      const entry = {
        Name: emp.name,
        Profile: emp.role?.description,
        Phone: emp.phone,
        Email: emp.email,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `Employee_List_${timestamp}.csv`);
  }

  viewEmployee(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editEmployee(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
