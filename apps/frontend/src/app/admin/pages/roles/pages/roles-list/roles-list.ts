import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { Pagination } from '../../../../../common/components/pagination/pagination';
import { SearchInputWidget } from '../../../../../common/components/search-input-widget/search-input-widget';
import { MetaService } from '../../../../../common/services/meta.service';
import { PaginatedData, Role } from '@newmbani/types';
import { Breadcrumb } from '../../../../../common/components/breadcrumb/breadcrumb';
import { DropdownMenu } from '../../../../../common/components/dropdown-menu/dropdown-menu';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.html',
  styleUrls: ['./roles-list.scss'],
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
export class RolesList implements OnInit, OnDestroy {
  // Signals
  roles = signal<Role[]>([]);
  isLoading = signal<boolean>(true);
  keyword = signal<string>('');
  paginatedData = signal<PaginatedData | undefined>(undefined);
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);
  selectedRoles = signal<string[]>([]);
  
  // Computed signals
  hasSelectedRoles = computed(() => this.selectedRoles().length > 0);
  selectedCount = computed(() => this.selectedRoles().length);
  hasRoles = computed(() => this.roles().length > 0);

  form: FormGroup = new FormGroup({});
  @ViewChild('selectAll') selectAll!: ElementRef;
  
  private destroy$ = new Subject<boolean>();

  breadcrumb: Breadcrumb = {
    links: [
      {
        linkTitle: 'Authorization',
        isClickable: false,
      },
      {
        linkTitle: 'Roles',
        isClickable: false,
      },
    ],
  };

  // Injected services
  private metaService = inject(MetaService);
  private router = inject(Router);
  private rolesService = inject(RolesService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Roles',
            isClickable: false,
          },
        ],
      },
      title: 'Roles',
      description: 'Roles',
    });
  }

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.isLoading.set(true);
    
    this.rolesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.roles.set(res.data);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching roles:', err);
          this.isLoading.set(false);
        },
      });
  }

  addRole(): void {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  updateKeyword(keyword: string): void {
    this.keyword.set(keyword);
  }

  search(): void {
    // Implement search logic
    const searchTerm = this.keyword().toLowerCase();
    
    if (!searchTerm) {
      this.fetchRoles();
      return;
    }

    // Filter roles based on keyword
    const allRoles = this.roles();
    const filtered = allRoles.filter(role => 
      role.name.toLowerCase().includes(searchTerm) ||
      role.description?.toLowerCase().includes(searchTerm)
    );
    
    this.roles.set(filtered);
  }

  changePageSize(pageSize: number): void {
    if (pageSize !== this.pageSize()) {
      this.pageSize.set(+pageSize);
      this.currentPage.set(1);
      // this.navigateToNextPage({});
    }
  }

  exportTableToCSV = (): void => {
    console.log('Exporting table to CSV...');
    // Implement CSV export logic
  };

  printStatement = (): void => {
    console.log('Printing selected roles:', this.selectedRoles());
    // Implement print logic
  };

  onCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const roleId = checkbox.value;
    
    if (checkbox.checked) {
      // Add to selected roles
      this.selectedRoles.update(current => [...current, roleId]);
    } else {
      // Remove from selected roles
      this.selectedRoles.update(current => 
        current.filter(id => id !== roleId)
      );
    }
  }

  onSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      // Select all roles
      const allRoleIds = this.roles().map(role => role._id);
      this.selectedRoles.set(allRoleIds);
    } else {
      // Deselect all
      this.selectedRoles.set([]);
    }
  }

  isChecked(id: string): boolean {
    return this.selectedRoles().includes(id);
  }

  pageChange(page: number): void {
    this.currentPage.set(page);
    // this.onPageChange();
  }

  viewRole(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editRole(id: string): void {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}