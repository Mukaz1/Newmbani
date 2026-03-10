import { Routes } from '@angular/router';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./settings-wrapper').then((m) => m.SettingsWrapper),
    // canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/settings/settings').then((m) => m.SettingsComponent),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'landlord',
        loadChildren: () =>
          import('../admin/pages/required-documents/routes').then(
            (m) => m.routes
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../admin/pages/roles/roles.routes').then((r) => r.routes),
      },
      {
        path: '',
        loadChildren: () =>
          import('../countries/countries.routes').then((r) => r.routes),
      },
    ],
  },

  // { path: '**', redirectTo: '/landlord' },
];
