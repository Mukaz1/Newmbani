/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpResponseInterface,
  NotificationStatusEnum,
  PaginatedData,
  Landlord,
  Property,
} from '@newmbani/types';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import saveAs from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { DropdownMenu } from '../../../common/components/dropdown-menu/dropdown-menu';
import { Pagination } from '../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../common/components/search-input-widget/search-input-widget';
import { CsvExportService } from '../../../common/services/csv-export.service';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { PropertiesService } from '../../services/properties.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ConfirmDialog } from '../../../common/components/confirm-dialog/confirm-dialog';
import { take } from 'rxjs';
import { LandlordsService } from '../../../landlords/services/landlords.service';

@Component({
  selector: 'app-properties',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    Pagination,
    SearchInputWidget,
    DropdownMenu,
  ],
  templateUrl: './all-properties.html',
  styleUrl: './all-properties.scss',
})
export class AllProperties implements OnInit {
  isLoading = signal(true);
  error = signal<string | null>(null);
  landlord = signal<Landlord | null>(null);
  properties = signal<Property[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  selectedProperties = signal<string[]>([]);
  allSelected = signal(false);
  form: FormGroup = new FormGroup({});
  expressMode = signal<boolean | undefined>(undefined);
  categoryId = signal<string | undefined>(undefined);
  @ViewChild('selectAllElement') selectAllElement!: ElementRef;

  private readonly propertiesService = inject(PropertiesService);
  private readonly landlordsService = inject(LandlordsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly metaService = inject(MetaService);
  private readonly dialog = inject(Dialog);
  private readonly csvExportService = inject(CsvExportService);
  private readonly authService = inject(AuthService);

  user = computed(() => this.authService.user());

  constructor() {
    // this.patchQueryParams()
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Properties',
            isClickable: false,
          },
        ],
      },
      title: 'Properties',
      description: 'Properties',
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe((param) => {
      const isEmpty = param.keys.length === 0;
      if (isEmpty) {
        this.patchQueryParams();
      } else {
        const pageSize = param.get('limit') || this.pageSize();
        const keyword = param.get('keyword') || this.keyword();
        this.pageSize.set(+pageSize);
        this.keyword.set(keyword);
        this.fetchProperties();
      }
    });
    this.getLandlord();
  }

  getLandlord() {
    this.isLoading.set(true);
    const landlordId = this.user()?.landlordId;
    if (!landlordId) return;
    this.landlordsService
      .getLandlordProfileById(landlordId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.landlord.set(res.data as Landlord);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
        },
      });
  }
  onSelectAll(e: Event) {
    const checkArray = this.form.get('checkArray') as FormArray;

    const isChecked = (e.target as HTMLInputElement).checked;
    const properties = this.properties;
    const formValues = this.form.value.checkArray;

    if (isChecked && properties) {
      properties().map((property) => {
        const idAlreadyExists = formValues.includes(property._id);
        if (!idAlreadyExists) {
          checkArray.push(new FormControl(property._id));
        }
      });
    } else {
      checkArray.clear();
    }

    // this.getSelectedProperties();
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
    // this.getSelectedProperties();
  }
  checkIfAllIsSelected() {
    if (
      this.properties &&
      this.properties.length === this.form.value.checkArray.length
    ) {
      this.selectAllElement.nativeElement.checked = true;
    } else {
      this.selectAllElement.nativeElement.checked = false;
    }
  }
  getPropertyImageLink(payload: { property: Property; currentImage: number }) {
    const { property, currentImage } = payload;
    if (property.images && property.images.length > 0) {
      return property.images[currentImage].link;
    } else {
      return '/assets/img/no-image.jpg';
    }
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

  fetchProperties() {
    this.isLoading.set(true);
    this.propertiesService
      .getAllProperties({
        limit: this.pageSize(),
        page: this.currentPage(),
        categoryId: this.categoryId(),
        keyword: this.keyword(),
        landlordId: this.authService.user()?.landlordId,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: HttpResponseInterface<PaginatedData<Property[]>>) => {
          this.properties.set(res.data.data);
          this.paginatedData.set(res.data);
          this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.notificationService.notify({
            title: 'Error',
            message: error.error.message || 'Failed to fetch properties',
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
    this.patchQueryParams();
  }

  selectAll(event: any) {
    const value: boolean = event.target.checked as boolean;
    this.allSelected.set(value);
  }

  selectProperty(event: any, orderId: any) {
    const value: boolean = event.target.checked as boolean;
    if (value) {
      this.selectedProperties.set([
        ...this.selectedProperties().filter((order) => order !== orderId),
        orderId,
      ]);
    } else {
      this.selectedProperties.set([
        ...this.selectedProperties().filter((order) => order !== orderId),
      ]);
    }
    this.allSelected.set(
      this.selectedProperties().length === this.properties().length
    );
  }

  isChecked(id: string) {
    this.selectedProperties().some((item) => item === id);
  }

  viewProperty(propertyslug: string) {
    return this.router.navigate([propertyslug], { relativeTo: this.route });
  }


  editProperty(id: string) {
    this.router.navigate([id, 'edit'], {relativeTo: this.route})
  }

  printStatement = () => {
    console.log('Printing...');
  };

  async exportTableToCSV(): Promise<void> {
    const data: object[] = [];
    this.properties().map((emp) => {
      const entry = {
        Name: emp.name,
      };
      data.push(entry);
    });
    const res = this.csvExportService.exportCSV(data);
    const timestamp = Date.now().toString();
    saveAs(res, `Properties_${timestamp}.csv`);
  }

  addNewProperty() {
    if (this.isLandlord() && !this.landlord()?.verified) {
      this.notificationService.notify({
        status: NotificationStatusEnum.ERROR,
        title: 'Error',
        message:
          'Your landlord account must be verified before you can add a new property.',
      });
      return;
    }
this.router.navigate(['create'], {relativeTo:this.route})
  }
  deleteProperty(property: Property) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${property.name}"?`,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        confirmButtonStyle:
          'bg-red-500 text-white rounded-full !hover:bg-red-600 transition-colors',
      },
    });

    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed as boolean) {
          this.propertiesService
            .deleteProperty(property._id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.properties.update((list) =>
                  list.filter((p) => p._id !== property._id)
                );
                this.notificationService.notify({
                  title: 'Success!',
                  message: 'Property deleted successfully',
                  status: NotificationStatusEnum.SUCCESS,
                });
              },
              error: (err: Error) => {
                this.notificationService.notify({
                  title: 'Error',
                  message: err.message,
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        }
      });
  }
  isLandlord(): boolean {
    return this.authService.getUserType().landlord;
  }
}
