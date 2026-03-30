import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  PropertiesSubCategory,
  PropertyCategory,
} from '@newmbani/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../common/services/notification.service';
import { Dialog } from '@angular/cdk/dialog';
import { MetaService } from '../../../common/services/meta.service';
import { CategoriesService } from '../../services/categories.service';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CsvExportService } from '../../../common/services/csv-export.service';
import { Router } from '@angular/router';
import saveAs from 'file-saver';
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
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { DropdownMenu } from '../../../common/components/dropdown-menu/dropdown-menu';
import { PropertiesSubCategoryModal } from '../modals/property-subcategory-modal/property-subcategory-modal';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-property-subcategories-list',

  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    RouterLink,
    Pagination,
    SearchInputWidget,
    DropdownMenu,
  ],
  templateUrl: './property-subcategories-list.html',
  styleUrl: './property-subcategories-list.scss',
})
export class PropertieSubcategoriesList
  implements OnInit, AfterViewInit
{
  // Use signals for reactive state
  propertiesubCategories = signal<PropertiesSubCategory[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  loading = signal<boolean>(true);
  keyword = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  selectedPropertiesubCategories = signal<string[]>([]);

  form: FormGroup = new FormGroup({});

  @ViewChild('selectAll') selectAll!: ElementRef;
  destroy$ = new Subject();

  private csvExportService = inject(CsvExportService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private categoriesService = inject(CategoriesService);
  private notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  dialog = inject(Dialog);
  private destroyRef = inject(DestroyRef);
  private metaService = inject(MetaService);

  // store categories and a lookup map for categoryId -> name
  private categories = signal<PropertyCategory[]>([]);
  getCategoryNameById = (categoryId?: string): string => {
    if (!categoryId) return 'N/A';
    const found = this.categories().find(
      (c) =>
        (c as PropertyCategory)._id === categoryId ||
        (c as PropertyCategory)._id === categoryId
    );
    return found?.name || 'N/A';
  };

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Property Subcategories',
            isClickable: false,
          },
        ],
      },
      title: 'Property Subcategories',
      description: 'Property Subcategories',
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
    // Load categories for name resolution
    this.categoriesService
      .getCategories({ limit: 1000, page: 1, keyword: '' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = (res as HttpResponseInterface).data as PaginatedData;
          this.categories.set((data?.data as PropertyCategory[]) || []);
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.error(error);
        },
      });

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.getPropertiesubCategories();
    });
  }

  getPropertiesubCategories() {
    this.paginatedData.set(undefined);
    this.loading.set(true);
    this.changeDetectorRef.detectChanges();

    this.categoriesService
      .getSubcategories({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.keyword(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const data = (res as HttpResponseInterface).data as PaginatedData;
          if (data) {
            this.paginatedData.set(data);
            this.propertiesubCategories.set(data.data);
            this.loading.set(false);
            this.changeDetectorRef.detectChanges();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  addPropertiesSubCategoryModal() {
    const modalRef = this.dialog.open(PropertiesSubCategoryModal);
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const propertiesubcategory: PropertiesSubCategory =
          res as PropertiesSubCategory;
        // append propertiesubcategory to propertiesubCategories list
        if (!propertiesubcategory) return;
        this.propertiesubCategories.update((currentSubCategories) => [
          ...currentSubCategories,
          propertiesubcategory,
        ]);
        this.notificationService.notify({
          title: 'Success',
          message: 'Property Subcategory added successfully',
          status: NotificationStatusEnum.SUCCESS,
        });
      });
  }

  editPropertiesSubCategoryModal(propertiesubcategory: PropertiesSubCategory) {
    const modalRef = this.dialog.open(PropertiesSubCategoryModal, {
      data: {
        title: 'Edit Property Subcategory',
        propertiesubcategory,
      },
    });
    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: any) => {
        const propertiesubcategory: PropertiesSubCategory =
          res as PropertiesSubCategory;
        if (!propertiesubcategory) return;

        this.getPropertiesubCategories(); // Reload the entire list after editing
        this.notificationService.notify({
          title: 'Success',
          message: 'Property Subcategory updated successfully',
          status: NotificationStatusEnum.SUCCESS,
        });
      });
  }

  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;

    const isChecked = (e.target as HTMLInputElement).checked;
    const propertiesubCategories = this.propertiesubCategories();
    const formValues = this.form.value.checkArray;

    if (isChecked && propertiesubCategories) {
      propertiesubCategories.forEach((propertiesubcategory) => {
        const idAlreadyExists = formValues.includes(propertiesubcategory._id);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(propertiesubcategory._id));
        }
      });
    } else {
      checkArray.clear();
    }

    this.getSelectedPropertiesubCategories();
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
    this.getSelectedPropertiesubCategories();
  }

  getSelectedPropertiesubCategories() {
    this.selectedPropertiesubCategories.set(this.form.value.checkArray);
    this.changeDetectorRef.detectChanges();
  }

  checkIfAllIsSelected() {
    const propertiesubCategories = this.propertiesubCategories();
    if (
      propertiesubCategories &&
      propertiesubCategories.length === this.form.value.checkArray.length
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
    this.currentPage.set(1); // Reset to first page when searching
    this.onPageChange();
  }

  changePageSize(pageSize: number) {
    if (pageSize !== this.pageSize()) {
      this.pageSize.set(pageSize);
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
      this.router.navigateByUrl(
        `/admin/property-categories/subcategories?${params}`
      );
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
    this.router.navigateByUrl(
      `/admin/property-categories/subcategories?${params}`
    );
  }

  printStatement = () => {
    console.log('Printing...');
  };

  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.propertiesubCategories().map((emp: PropertiesSubCategory) => {
      const entry = {
        Name: emp.name,
        Description: emp.description,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `SubCategory_List_${timestamp}.csv`);
  }
}
