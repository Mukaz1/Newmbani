import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'countries',
    canActivate: [AuthGuard, AdminGuard],

    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/countries/countries').then(
            (m) => m.Countries
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: ':countryId',
        loadComponent: () =>
          import('./pages/view-country/view-country').then(
            (m) => m.ViewCountry
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
    ],
  },
];
