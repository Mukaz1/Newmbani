import { Component, ChangeDetectorRef, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
  FormsModule,
} from '@angular/forms';
import 'zone.js';
import { RolesService } from '../../services/roles.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  HttpStatusCodeEnum,
  NotificationStatusEnum,
  Role,
  UpdateRole,
} from '@newmbani/types';
import { ReactiveFormsModule } from '@angular/forms';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../../../common/services/meta.service';
import { NotificationService } from '../../../../../common/services/notification.service';
import { Button } from '../../../../../common/components/button/button';
import { PermissionDisplayPipe } from '../../../../../common/pipes/permission-display.pipe';

// Validator function for minimum selected checkboxes
function minSelectedCheckboxes(min = 1) {
  const validator: ValidatorFn = (formArray: any) => {
    const totalSelected = formArray.controls
      .map((control: any) => control.value)
      .reduce((prev: number, next: boolean) => (next ? prev + 1 : prev), 0);
    return totalSelected >= min ? null : { requireCheckboxesToBeChecked: true };
  };
  return validator;
}

@Component({
  selector: 'app-assign-permissions-to-role',
  templateUrl: './assign-permissions-to-role.html',
  styleUrls: ['./assign-permissions-to-role.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    PermissionDisplayPipe,
    Button,
  ],
})
export class AssignPermissionsToRole implements OnDestroy {
  form: FormGroup;
  permissionsData: { permission: string }[] = [];
  filteredPermissions: { permission: string }[] = [];
  existingPermissions: string[] = [];
  isLoading = true;
  roleId: string | null = null;
  _role: Role | null = null;

  destroy$ = new Subject();
  get permissionsFormArray() {
    return this.form.controls['permissions'] as FormArray;
  }

  formBuilder = inject(FormBuilder);
  rolesService = inject(RolesService);
  changeDetectorRef = inject(ChangeDetectorRef);
  metaService = inject(MetaService);
  notificationsService = inject(NotificationService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  constructor() {
    this.roleId = this.route.snapshot.paramMap.get('id');
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Assign Permissions',
            isClickable: false,
          },
        ],
      },
      title: 'Assign Permissions to Role',
      description: 'Assign Permissions to Role',
    });
    this.form = this.formBuilder.group({
      permissions: new FormArray([], minSelectedCheckboxes(1)),
    });
    if (this.roleId) {
      // Get the role related data
      this.rolesService
        .getRoleById(this.roleId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            this._role = res.data;
            this.existingPermissions = res.data.permissions;
            this.patchPermissions(res.data.permissions);
            this.changeDetectorRef.detectChanges();
          },
          error: (err: HttpErrorResponse) => {
            console.log(err);
          },
        });
    }

    // async permissions
    this.rolesService
      .getPermissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe((permissions: any) => {
        this.permissionsData = permissions.data;
        this.addCheckboxes();
        this.changeDetectorRef.detectChanges();
      });
  }

  checkIfSelected(permission: string): boolean {
    if (this._role && this._role.permissions) {
      const exists = this._role.permissions.find((_permission: string) => {
        return permission === _permission;
      });
      if (exists) {
        return true;
      }
      return false;
    }
    return false;
  }
  private addCheckboxes() {
    const permissionsArray = this.form.get('permissions') as FormArray;
    permissionsArray.clear();

    this.permissionsData.forEach(() => {
      permissionsArray.push(new FormControl(false));
    });

    this.isLoading = false;
    this.changeDetectorRef.detectChanges();
  }

  syncPermissions() {
    if (
      this._role &&
      this._role.permissions &&
      this._role.permissions.length > 0
    ) {
      const permissionsArray = this.form.get('permissions') as FormArray;
      permissionsArray.clear();

      this.permissionsFormArray.setValue(this._role.permissions);
      this.changeDetectorRef.detectChanges();
    }
  }

  // Function to patch permissions into the form
  patchPermissions(selectedPermissions: string[]) {
    const permissionsArray = this.form.get('permissions') as FormArray;
    permissionsArray.clear();

    this.permissionsData.forEach((permission, index) => {
      const isSelected = selectedPermissions.includes(permission.permission);
      permissionsArray.push(new FormControl(isSelected));
    });

    this.changeDetectorRef.detectChanges();
  }

  submit() {
    this.isLoading = true;
    this.changeDetectorRef.detectChanges();

    const selectedPermissions = this.form.value.permissions
      .map((checked: boolean, i: number) =>
        checked ? this.permissionsData[i].permission : null
      )
      .filter((v: { permission: string }) => v !== null);
    const permissions: string[] = Object.values(selectedPermissions);
    const payload: UpdateRole = {
      permissions,
    };

    if (this.roleId) {
      this.rolesService.updateRole(this.roleId, payload).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
          if (response.statusCode === HttpStatusCodeEnum.UNAUTHORIZED) {
            return this.notificationsService.notify({
              title: 'Error!',
              message: response.message,
              status: NotificationStatusEnum.ERROR,
            });
          }
          if (response.statusCode === HttpStatusCodeEnum.FOUND) {
            return this.notificationsService.notify({
              title: 'Info!',
              message: response.message,
              status: NotificationStatusEnum.INFO,
            });
          }

          this.notificationsService.notify({
            title: 'SUCCESS!',
            message: response.message,
            status: NotificationStatusEnum.SUCCESS,
          });
          const roleId = response.data._id;

          this.router.navigateByUrl(`admin/settings/roles/${roleId}`);
        },
        error: (error: HttpErrorResponse) => {
          console.error({ error });
          this.isLoading = false;
          this.notificationsService.notify({
            title: 'Error!',
            message: error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
