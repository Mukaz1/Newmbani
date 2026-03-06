import { Component, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CreateRole,
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Role,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import { MetaService } from '../../../../../common/services/meta.service';
import { NotificationService } from '../../../../../common/services/notification.service';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.html',
  styleUrls: ['./add-role.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    Button,
    RouterLink,
  ],
})
export class AddRole implements OnDestroy {
  isLoading = false;
  registerRoleForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });
  destroy$ = new Subject();

  private readonly router = inject(Router);
  private readonly notificationsService = inject(NotificationService);
  private readonly metaService = inject(MetaService);
  private readonly rolesService = inject(RolesService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

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
            linkTitle: 'Create New Role',
            isClickable: false,
          },
        ],
      },
      title: 'Create New Role',
      description: 'Create a New Role',
    });
  }

  createRole(): void {
    this.isLoading = true;
    if (this.registerRoleForm.valid) {
      const { name, description } = this.registerRoleForm.value;

      const payload: CreateRole = {
        name,
        description,
        permissions: [],
      };
      const res = this.rolesService.addRole(payload);

      res.pipe(takeUntil(this.destroy$)).subscribe({
        next: async (response: any) => {
          const role: Role = response.data;
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
          if (response.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
            return this.notificationsService.notify({
              title: 'Error!',
              message: response.message,
              status: NotificationStatusEnum.ERROR,
            });
          }
          this.notificationsService.notify({
            title: 'SUCCESS!',
            message: response.message,
            status: NotificationStatusEnum.SUCCESS,
          });
          await this.router.navigateByUrl(
            `admin/settings/roles/${role._id}/assign-permissions`
          );
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
      this.changeDetectorRef.detectChanges();
      this.notificationsService.notify({
        title: 'Missing Fields!',
        message: 'Check your register role form before submitting',
        status: NotificationStatusEnum.ERROR,
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
