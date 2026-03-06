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
          import('../bookings/pages/bookings/bookings').then(
            (m) => m.Bookings
          ),
        canActivate: [AuthGuard, AdminGuard],
      },

      {
        path: 'bookings/:id',
        loadComponent: () =>
          import('../bookings/pages/view-bookings/view-bookings').then(
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
        path: 'property-listings',
        loadComponent: () =>
          import(
            '../property-listing/pages/all-property-listing/all-property-listing'
          ).then((m) => m.AllPropertyListing),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'property-listings/:id',
        loadComponent: () =>
          import(
            '../property-listing/pages/view-property-listing/view-property-listing'
          ).then((m) => m.ViewPropertyListing),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('../payments/payments.routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },

      {
        path: '',
        loadChildren: () => import('../amenities/routes').then((r) => r.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'properties',
        canActivate: [AuthGuard, AdminGuard],
        children: [
          {
            path: 'create',
            loadComponent: () =>
              import(
                '../properties/pages/manage-property/manage-property'
              ).then((m) => m.ManageProperty),
            canActivate: [AuthGuard, AdminGuard],
          },
        ],
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/hosts/pages/host-analytics/host-analytics').then(
            (m) => m.HostAnalytics
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/hosts/pages/host-messages/host-messages').then(
            (m) => m.HostMessages
          ),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/routes').then((m) => m.routes),
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: 'hosts',
        loadChildren: () =>
          import('./pages/hosts/host.routes').then((r) => r.routes),
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
      {
        path: 'help-center',
        loadChildren: () =>
          import('../help-center/help-center.routes').then((r) => r.routes),
      },
    ],
  },
  { path: '**', redirectTo: '/admin/dashboard', pathMatch: 'prefix' },
];
