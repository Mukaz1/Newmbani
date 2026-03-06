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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { MetaService } from '../../../../../common/services/meta.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpResponseInterface,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Role,
  UpdateRole,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.html',
  styleUrls: ['./edit-role.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    Button,
    RouterLink,
  ],
})
export class EditRole implements OnInit, OnDestroy {
  roleId: string | null = null;
  role: Role | null = null;
  isLoading = false;
  editRoleForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  destroy$ = new Subject();

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
            linkTitle: 'Roles',
            isClickable: true,
            link: '/admin/settings/roles',
          },
          {
            linkTitle: 'Edit Role',
            isClickable: false,
          },
        ],
      },
      title: 'Edit Role',
      description: 'Edit Role',
    });
  }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('id');

    if (this.roleId) {
      this.rolesService
        .getRoleById(this.roleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: HttpResponseInterface<Role | null>) => {
            if (res.data) {
              const role: Role = res.data;
              this.role = role;
              this.changeDetectorRef.detectChanges();
              this.patchForm();
            }
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error fetching role:', error);
            this.notificationsService.notify({
              title: 'Error!',
              message: 'Failed to load role data',
              status: NotificationStatusEnum.ERROR,
            });
          },
        });
    }
  }

  patchForm() {
    if (this.role) {
      this.editRoleForm.patchValue({
        name: this.role.name,
        description: this.role.description || '',
      });
    }
  }

  discard() {
    if (this.role) {
      this.editRoleForm.patchValue({
        name: this.role.name,
        description: this.role.description || '',
      });
    }
  }

  updateRole(): void {
    this.isLoading = true;
    if (this.editRoleForm.valid && this.roleId) {
      const { name, description } = this.editRoleForm.value;
      const payload: UpdateRole = {
        name,
        description,
        permissions: this.role?.permissions || [],
      };

      this.rolesService
        .updateRole(this.roleId, payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: HttpResponseInterface<Role | null>) => {
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

            this.router.navigate(['/admin/settings/roles/', this.roleId]);
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
        message: 'Check your role update form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

