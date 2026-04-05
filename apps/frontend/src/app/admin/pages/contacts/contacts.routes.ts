import { Routes } from '@angular/router';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { PermissionEnum } from '@newmbani/types';
import { permissionGuard } from '../../../common/guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
    //   {
    //     path: '',
    //     canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_CONTACTS, PermissionEnum.MANAGE_CONTACT])],
    //     component: AllContacts,
    //   },

    //   {
    //     path: ':id',
    //     canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_CONTACT, PermissionEnum.MANAGE_CONTACT])],
    //     component: ViewContact ,
    //   },
    ],
  },
];
