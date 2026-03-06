import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../services/roles.service';
import { take, Subscription } from 'rxjs';
import {
  NotificationStatusEnum,
  Permission,
  Role,
  HttpResponseInterface,
} from '@newmbani/types';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { MetaService } from '../../../../../common/services/meta.service';
import { PermissionDisplayPipe } from '../../../../../common/pipes/permission-display.pipe';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuModule,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../../../../common/services/notification.service';
import { groupPermissionsByCategory } from '@newmbani/utils';
import { KeyValuePipe } from '@angular/common';
import { ToggleInput } from '../../../../../common/components/toggle-input/toggle-input copy';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.html',
  styleUrls: ['./view-role.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataLoading,
    PermissionDisplayPipe,
    RouterLink,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    CdkMenuModule,
    KeyValuePipe,
    ToggleInput,
  ],
})
export class ViewRole implements OnInit {
  private readonly metaService = inject(MetaService);
  private readonly route = inject(ActivatedRoute);
  private readonly rolesService = inject(RolesService);
  private readonly notificationsService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  allPermissions = signal<Permission[]>([]);
  role = signal<Role | null>(null);
  groupedPermissions = computed(() =>
    groupPermissionsByCategory(this.allPermissions() ?? [])
  );
  form!: FormGroup;
  get permissionsArray() {
    return this.form.get('permissions') as FormArray;
  }
  isLoading = signal(false);
  private formChangesSub: Subscription | null = null;
  private updateTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly updateDebounceMs = 500;

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
            linkTitle: 'View Role',
            isClickable: false,
          },
        ],
      },
      title: 'View Role',
      description: 'View Role',
    });
    // Rebuild the form whenever permissions or role change so we can
    // reflect selected permissions from the role against all permissions.
    effect(() => {
      // Read signals to create dependency
      const available = this.allPermissions();
      const r = this.role();

      // Build form controls with initial values derived from role.permissions
      const controls = (available ?? []).map((p) =>
        this.fb.control(!!(r?.permissions && r.permissions.includes(p.name)))
      );

      // unsubscribe previous valueChanges subscription if present
      if (this.formChangesSub) {
        try {
          this.formChangesSub.unsubscribe();
        } catch {
          // ignore
        }
        this.formChangesSub = null;
      }

      this.form = this.fb.group({
        permissions: this.fb.array(controls),
      });

      // Subscribe to changes and persist with a small debounce
      this.formChangesSub = this.form.valueChanges.subscribe(() => {
        // debounce updates to avoid many API calls while user toggles
        if (this.updateTimer) clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
          const roleId = this.role()?._id;
          if (!roleId) return;

          const selected = this.allPermissions()
            .filter((_, i) => this.permissionsArray.at(i).value as boolean)
            .map((p) => p.name);

          this.updateRolePermissions(roleId, selected);
        }, this.updateDebounceMs);
      });
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadPermissions();
    if (id) {
      this.loadRole(id);
    }

    this.form.valueChanges.subscribe((val) => {
      console.log({ val });
    });
  }
  get selectedPermissions() {
    return this.allPermissions()
      .filter((_, i) => this.permissionsArray.at(i).value)
      .map((p) => p.name);
  }

  loadPermissions() {
    this.isLoading.set(false);
    this.rolesService
      .getPermissions()
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);

          this.allPermissions.set(res.data);
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.isLoading.set(false);
        },
      });
  }

  loadRole(id: string): void {
    this.isLoading.set(true);
    this.rolesService
      .getRoleById(id)
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponseInterface<Role | null>) => {
          this.role.set(res.data as Role);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.isLoading.set(false);
          this.notificationsService.notify({
            status: NotificationStatusEnum.ERROR,
            title: 'Error',
            message: err.error.message,
          });
        },
      });
  }

  private updateRolePermissions(roleId: string, permissions: string[]) {
    const payload = { permissions };
    this.rolesService
      .updateRole(roleId, payload)
      .pipe(take(1))
      .subscribe({
        next: (res: HttpResponseInterface<Role | null>) => {
          // update local role signal if returned
          if (res && res.data) {
            this.role.set(res.data as Role);
          }
          this.notificationsService.notify({
            title: 'Permissions updated',
            message: res?.message || 'Permissions updated successfully',
            status: NotificationStatusEnum.SUCCESS,
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.notificationsService.notify({
            title: 'Error',
            message:
              err?.error?.message ||
              err.message ||
              'Failed to update permissions',
            status: NotificationStatusEnum.ERROR,
          });
          // On error, reload role to reflect server state
          this.loadRole(roleId);
        },
      });
  }

  viewUser(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editUser(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  // Return the index of a permission in the allPermissions list.
  // Used by the template to bind the correct FormArray control for
  // permissions grouped by category.
  permissionIndex(permission: Permission): number {
    return this.allPermissions().findIndex((p) => p.name === permission.name);
  }

  // Return how many permissions in a group are assigned to the current role
  selectedCountForGroup(groupPermissions: Permission[]): number {
    const rolePerms = this.role()?.permissions ?? [];
    if (!rolePerms || rolePerms.length === 0) return 0;
    return groupPermissions.filter((p) => rolePerms.includes(p.name)).length;
  }
}
