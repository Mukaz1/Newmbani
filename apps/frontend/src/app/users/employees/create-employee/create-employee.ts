import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MetaService } from '../../../common/services/meta.service';
import { NotificationService } from '../../../common/services/notification.service';
import { EmployeesService } from '../../../admin/services/employees.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCodeEnum, NotificationStatusEnum } from '@newmbani/types';
import { RegisterEmployee, Role, HttpResponseInterface } from '@newmbani/types';
import { RolesService } from '../../../admin/pages/roles/services/roles.service';
import { Button } from '../../../common/components/button/button';
import { passwordValidator } from '../../../common/utils/passwordValidator.util';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.html',
  styleUrls: ['./create-employee.scss'],
  imports: [FormsModule, ReactiveFormsModule, Button],
})
export class CreateEmployee implements OnInit, OnDestroy {
  employee: RegisterEmployee[] = [];
  roles: Role[] = [];

  isLoading = false;

  registerNewEmployee: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, passwordValidator()]),
    roleId: new FormControl('', [Validators.required]),
  });
  destroy$ = new Subject();
  private readonly router = inject(Router);
  private readonly employeesService = inject(EmployeesService);
  private readonly notificationsService = inject(NotificationService);
  private readonly metaService = inject(MetaService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly rolesService = inject(RolesService);

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
            linkTitle: 'New Employee',
            isClickable: false,
          },
        ],
      },
      title: 'New Employee',
      description: 'New Employee',
    });
  }

  ngOnInit(): void {
    this.rolesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.roles = res.data;
        this.changeDetectorRef.detectChanges();
      });
  }

  submit(): void {
    this.isLoading = true;

    if (this.registerNewEmployee.valid) {
      const { name, email, password, phone, roleId } =
        this.registerNewEmployee.value;

      const new_employee: RegisterEmployee = {
        name,
        email,
        password,
        phone,
        roleId,
      };

      this.employeesService
        .addEmployee(new_employee)
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
            if (response.statusCode === HttpStatusCodeEnum.FOUND) {
              this.notificationsService.notify({
                title: 'Warning!',
                message: response.message,
                status: NotificationStatusEnum.WARNING,
              });
              return;
            }
            if (response.statusCode === HttpStatusCodeEnum.BAD_REQUEST) {
              this.notificationsService.notify({
                title: 'Warning!',
                message: response.message,
                status: NotificationStatusEnum.WARNING,
              });
              return;
            }

            this.notificationsService.notify({
              title: 'SUCCESS!',
              message: response.message,
              status: NotificationStatusEnum.SUCCESS,
            });
            this.router.navigateByUrl(`/admin/employees/${response.data._id}`);
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
      this.notificationsService.notify({
        title: 'Error!',
        message: 'Check your employee registration form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }
  discard() {
    this.registerNewEmployee.reset();
  }
  // Go back to employee list
  goToEmployeeList(): void {
    this.router.navigateByUrl('/admin/employees');
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
