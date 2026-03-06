import { EmployeesService } from '../../../admin/services/employees.service';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../../admin/pages/roles/services/roles.service';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';

import { DataLoading } from '../../../common/components/data-loading/data-loading';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Employee,
  Role,
  HttpResponseInterface,
  UpdateEmployee,
} from '@newmbani/types';
import { Button } from '../../../common/components/button/button';
@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.html',
  styleUrls: ['./edit-employee.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    Button,
  ],
})
export class EditEmployee implements OnInit, OnDestroy {
  employeeId: string | null = null;
  employee: Employee | null = null;
  roles: Role[] = [];

  isLoading = false;
  editEmployeeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    roleId: new FormControl('', [Validators.required]),
  });
  destroy$ = new Subject();

  private readonly employeesService = inject(EmployeesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly rolesService = inject(RolesService);
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Employees',
            isClickable: true,
            link: '/admin/employees',
          },
          {
            linkTitle: 'Update Employee',
            isClickable: false,
          },
        ],
      },
      title: 'Update Employee',
      description: 'Update Employee',
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');

    if (this.employeeId) {
      this.employeesService
        .getEmployeeById(this.employeeId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface) => {
            const employee: Employee = res.data;
            this.employee = employee;
            this.changeDetectorRef.detectChanges();
            this.patchForm();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching employee:', error);
            this.notificationsService.notify({
              title: 'Error!',
              message: 'Failed to load employee data',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    }
    // Get all the roles in the system
    this.rolesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.roles = res.data;
          this.changeDetectorRef.detectChanges();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching roles:', error);
          this.notificationsService.notify({
            title: 'Error!',
            message: 'Failed to load roles',
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
  }

  patchForm() {
    if (this.employee) {
      this.editEmployeeForm.patchValue({
        name: this.employee.name,
        email: this.employee.email,
        phone: this.employee.phone,
        roleId: this.employee.roleId?.toString() || '',
      });
    }
  }

  discard() {
    if (this.employee) {
      this.editEmployeeForm.patchValue({
        name: this.employee.name,
        email: this.employee.email,
        phone: this.employee.phone,
        roleId: this.employee.roleId?.toString() || '',
      });
    }
  }

  goToEmployeeList(): void {
    this.router.navigateByUrl('/admin/employees');
  }
  editEmployee(): void {
    this.isLoading = true;
    if (this.editEmployeeForm.valid && this.employeeId) {
      const { name, email, phone, roleId } = this.editEmployeeForm.value;

      const employee: UpdateEmployee = {
        name,
        phone,
        email,
        roleId,
      };

      this.employeesService
        .updateEmployee(this.employeeId, employee)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: HttpResponseInterface) => {
            this.isLoading = false;
            if (response.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
              this.notificationsService.notify({
                title: 'Error!',
                message: response.message,
                status: NotificationStatusEnum.ERROR,
              });
              return;
            }

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message,
              status: NotificationStatusEnum.SUCCESS,
            });

            this.router.navigate(['/admin/employees/', this.employeeId]);
            return;
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading = false;
            this.notificationsService.notify({
              title: 'Error!',
              message: error.message,
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    } else {
      this.isLoading = false;
      this.notificationsService.notify({
        title: 'Error!',
        message: 'Check your employee update form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
