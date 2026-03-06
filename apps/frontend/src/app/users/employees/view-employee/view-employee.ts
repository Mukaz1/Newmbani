import { EmployeesService } from '../../../admin/services/employees.service';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../../admin/pages/roles/services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Employee, Role, HttpResponseInterface } from '@newmbani/types';
import { MetaService } from '../../../common/services/meta.service';
import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { InitialsPipe } from '../../../common/pipes/initials.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.html',
  styleUrls: ['./view-employee.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    RouterLink,
    InitialsPipe,
    DatePipe,
  ],
})
export class ViewEmployee implements OnInit, OnDestroy {
  employeeId: string | null = null;
  employee: Employee | null = null;
  roles: Role[] = [];
  isLoading = true;
  private readonly employeesService = inject(EmployeesService);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly metaService = inject(MetaService);
  private readonly rolesService = inject(RolesService);
  private router = inject(Router);
  destroy$ = new Subject();

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.employeesService
        .getEmployeeById(this.employeeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface) => {
            this.employee = res.data;
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
            this.metaService.setMeta({
              breadcrumb: {
                links: [
                  {
                    linkTitle: 'Employees',
                    isClickable: true,
                    link: '/admin/employees',
                  },
                  {
                    linkTitle: 'Employee Profile',
                    isClickable: false,
                  },
                ],
              },
              title: `${this.employee?.name}'s Profile`,
              description: 'Employee Profile',
            });
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching employee:', error);
            this.isLoading = false;
            this.changeDetectorRef.detectChanges();
          },
        });
    }

    this.rolesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.roles = res.data;
          this.changeDetectorRef.detectChanges();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error fetching roles:', err);
        },
      });
  }

  getRoleById(): string {
    if (this.roles && this.employee) {
      const roleName = this.roles.find((role: Role) => {
        return role._id === this.employee?.roleId;
      })?.name;
      return roleName || '-';
    }
    return '-';
  }
  goToEmployeeList(): void {
    this.router.navigateByUrl('/admin/employees');
  }
  getRoleDescription(): string {
    if (this.roles && this.employee) {
      const roleDescription = this.roles.find((role: Role) => {
        return role._id === this.employee?.roleId;
      })?.description;
      return roleDescription || '-';
    }
    return '-';
  }
  getIcon(): string | null {
    return `/assets/media/avatar.webp`;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
