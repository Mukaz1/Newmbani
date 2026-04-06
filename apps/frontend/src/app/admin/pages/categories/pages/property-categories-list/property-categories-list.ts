import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../../../common/components/search-input-widget/search-input-widget';
import { MetaService } from '../../../../../common/services/meta.service';
import {
  HttpResponseInterface,
  PaginatedData,
  PropertyCategory,
} from '@newmbani/types';
import { CategoriesService } from '../../services/categories.service';
import { CsvExportService } from '../../../../../common/services/csv-export.service';
import saveAs from 'file-saver';
import { DropdownMenu } from '../../../../../common/components/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-property-categories-list',
  templateUrl: './property-categories-list.html',
  styleUrl: './property-categories-list.scss',
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
export class PropertyCategoriesList
  implements OnInit, OnDestroy, AfterViewInit
{
  propertyCategories: PropertyCategory[] = [];
  paginatedData: PaginatedData | undefined;
  filteredPropertyCategories: PropertyCategory[] = [];
  originalPropertyCategories: PropertyCategory[] = [];
  keyword = '';
  isLoading = true;

  pageSize = 50;
  currentPage = 1;
  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;
  selectedPropertyCategories: string[] = [];
  destroy$ = new Subject();

  metaService = inject(MetaService);
  private readonly router = inject(Router);
  changeDetectorRef = inject(ChangeDetectorRef);
  categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly csvExportService = inject(CsvExportService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Categories',
            isClickable: false,
          },
        ],
      },
      title: 'Property Categories',
      description: 'Property Categories',
    });

    this.route.queryParams
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
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getPropertyCategories();
    });
  }

  getPropertyCategories(): void {
    this.paginatedData = undefined;
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();
    this.categoriesService
      .getCategories({
        limit: this.pageSize,
        page: this.currentPage,
        keyword: this.keyword,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: HttpResponseInterface) => {
          const data: PaginatedData | undefined = res.data as PaginatedData;
          if (data) {
            this.paginatedData = data;
            this.propertyCategories = res.data.data;
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
          console.error('Error fetching categories:', error);
        },
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;

    const isChecked = (e.target as HTMLInputElement).checked;
    const propertyCategories = this.propertyCategories;
    const formValues = this.form.value.checkArray;

    if (isChecked && propertyCategories) {
      propertyCategories.forEach((propertyCategory) => {
        const idAlreadyExists = formValues.includes(propertyCategory._id);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(propertyCategory._id));
        }
      });
    } else {
      checkArray.clear();
    }

    this.getSelectedPropertyCategories();
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
    // check whether all are still selected
    this.checkIfAllIsSelected();
    this.getSelectedPropertyCategories();
  }

  getSelectedPropertyCategories() {
    this.selectedPropertyCategories = this.form.value.checkArray;
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    if (
      this.propertyCategories &&
      this.propertyCategories.length === this.form.value.checkArray.length
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

  addNewPropertyCategory() {
    this.router.navigate(['/admin/property-categories/categories/create']);
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
    this.currentPage = 1;
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

  navigateToNextPage(params: Params) {
    if (Object.keys(params).length) {
      const page = +(params['page'] ?? 1);
      const limit = +(params['limit'] ?? 10);
      const keyword = params['keyword'] ?? '';

      this.keyword = keyword;
      this.currentPage = page <= 0 ? 1 : page;
      this.pageSize = limit <= 0 ? 10 : limit;
    } else {
      const query = this.prepareQueryParams();
      this.router.navigateByUrl(
        `/admin/property-categories/categories?${query}`,
      );
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
    this.router.navigateByUrl(
      `/admin/property-categories/categories?${params}`,
    );
  }

  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.propertyCategories.map((emp) => {
      const entry = {
        Name: emp.name,
        Description: emp.description,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `Property_Categories_List${timestamp}.csv`);
  }

  viewPropertyCategory(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editPropertyCategory(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  // Add this method to handle the dropdown item selection event
  onItemSelect(event: any): void {
    // Handle the selected item here, e.g., log or perform actions based on selection
  }

  printStatement = () => {
    console.log('Printing...');
  };

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
