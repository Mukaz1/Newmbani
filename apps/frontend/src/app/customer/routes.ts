import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CustomerGuard } from '../auth/guards/customer.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout').then((m) => m.Layout),
    canMatch: [AuthGuard, CustomerGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(
            (m) => m.CustomerDashboard
          ),
        canMatch: [AuthGuard, CustomerGuard],
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./components/addresses/addresses').then((m) => m.Addresses),
        canMatch: [AuthGuard, CustomerGuard],
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('../bookings/pages/bookings/bookings').then(
            (m) => m.Bookings
          ),
        canMatch: [AuthGuard],
      },
      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('../bookings/pages/view-booking/view-booking').then(
            (m) => m.ViewBooking
          ),
        canMatch: [AuthGuard],
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('./components/addresses/addresses').then((m) => m.Addresses),
        canMatch: [AuthGuard],
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favourites/favourites').then((m) => m.Favourites),
        canMatch: [AuthGuard],
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./pages/invoices/invoices').then((m) => m.Invoices),
        canMatch: [AuthGuard, CustomerGuard],
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./pages/payments/payments').then((m) => m.Payments),
        canMatch: [AuthGuard, CustomerGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings').then((m) => m.SettingsComponent),
        canMatch: [AuthGuard, CustomerGuard],
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./pages/settings/pages/profile/profile').then(
                (m) => m.Profile
              ),
            canMatch: [AuthGuard, CustomerGuard],
          },
          {
            path: 'password',
            loadComponent: () =>
              import('./pages/settings/pages/password/password').then(
                (m) => m.Password
              ),
            canMatch: [AuthGuard, CustomerGuard],
          },
          {
            path: 'billing',
            loadComponent: () =>
              import('./pages/settings/pages/billing/billing').then(
                (m) => m.Billing
              ),
            canMatch: [AuthGuard, CustomerGuard],
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./pages/settings/pages/notifications/notifications').then(
                (m) => m.Notifications
              ),
            canMatch: [AuthGuard, CustomerGuard],
          },
        ],
      },
      { path: '**', redirectTo: '/customer/dashboard', pathMatch: 'full' },
    ],
  },
];
