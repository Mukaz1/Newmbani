import { Routes } from '@angular/router';
import { AllContacts } from './pages/all-contacts/all-contacts';
import { ViewContact  } from './pages/view-contact/view-contact';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { PermissionEnum } from '@newmbani/types';
import { permissionGuard } from '../../../common/guards/permissions.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_CONTACTS, PermissionEnum.MANAGE_CONTACT])],
        component: AllContacts,
      },

      {
        path: ':id',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_CONTACT, PermissionEnum.MANAGE_CONTACT])],
        component: ViewContact ,
      },
    ],
  },
];
