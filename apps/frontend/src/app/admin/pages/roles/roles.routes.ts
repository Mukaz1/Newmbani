import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { PermissionEnum } from '@newmbani/types';
import { permissionGuard } from '../../../common/guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [
      AuthGuard,
      permissionGuard([PermissionEnum.VIEW_ROLE, PermissionEnum.MANAGE_ROLE]),
    ],
    loadComponent: () =>
      import('./pages/roles-list/roles-list').then((m) => m.RolesList),
  },
  {
    path: 'create',
    canActivate: [
      AuthGuard,
      permissionGuard([PermissionEnum.CREATE_ROLE, PermissionEnum.MANAGE_ROLE]),
    ],
    loadComponent: () =>
      import('./pages/add-role/add-role').then(
        (m) => m.AddRole
      ),
  },
  {
    path: ':id',
    canActivate: [
      AuthGuard,
      permissionGuard([PermissionEnum.VIEW_ROLE, PermissionEnum.MANAGE_ROLE]),
    ],
    loadComponent: () =>
      import('./pages/view-role/view-role').then((m) => m.ViewRole),
  },
  {
    path: ':id/edit',
    canActivate: [
      AuthGuard,
      permissionGuard([PermissionEnum.UPDATE_ROLE, PermissionEnum.MANAGE_ROLE]),
    ],
    loadComponent: () =>
      import('./pages/edit-role/edit-role').then((m) => m.EditRole),
  },
  {
    path: ':id/assign-permissions',
    canActivate: [
      AuthGuard,
      permissionGuard([PermissionEnum.UPDATE_ROLE, PermissionEnum.MANAGE_ROLE]),
    ],
    loadComponent: () =>
      import(
        './pages/assign-permissions-to-role/assign-permissions-to-role'
      ).then((m) => m.AssignPermissionsToRole),
  },
];
