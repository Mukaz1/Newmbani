import { Routes } from '@angular/router';

import { AuthGuard } from '../auth/guards/auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard-wrapper').then((m) => m.DashboardWrapper),
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(
            (m) => m.AdminDashboard
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('../bookings/pages/all-bookings/all-bookings').then(
            (m) => m.AllBookings
          ),
        canActivate: [AuthGuard, AdminGuard],
      },

      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('../bookings/pages/view-booking/view-booking').then(
            (m) => m.ViewBooking
          ),
        canActivate: [AuthGuard, AdminGuard],
      },

      {
        path: 'properties',
        loadComponent: () =>
          import('../properties/pages/all-properties/all-properties').then(
            (m) => m.AllProperties
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'properties/:id',
        loadComponent: () =>
          import('../properties/pages/view-property/view-property').then(
            (m) => m.ViewProperty
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
  
  
      {
        path: 'settings',
        loadChildren: () => import('../settings/routes').then((m) => m.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'landlords',
        loadChildren: () =>
          import('./pages/landlords/landlord.routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('../users/customers/routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'employees',
        loadChildren: () =>
          import('../users/employees/routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'property-categories',
        loadChildren: () =>
          import('../categories/categories.routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('../admin/pages/contacts/contacts.routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      
    ],
  },
  { path: '**', redirectTo: '/admin/dashboard', pathMatch: 'prefix' },
];
