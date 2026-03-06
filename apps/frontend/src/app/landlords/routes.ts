import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LandlordGuard } from '../auth/guards/landlord.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/landlord-layout').then((m) => m.LandlordLayout),
    canMatch: [AuthGuard, LandlordGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/landlord-dashboard/landlord-dashboard').then(
            (m) => m.LandlordDashboard
          ),
        canMatch: [AuthGuard, LandlordGuard],
      },
      // {
      //   path: 'bookings',
      //   loadComponent: () =>
      //     import('../bookings/pages/all-bookings/all-bookings').then(
      //       (m) => m.Bookings
      //     ),
      //   canMatch: [AuthGuard, LandlordGuard],
      // },
      // {
      //   path: 'bookings/:id',
      //   loadComponent: () =>
      //     import('../bookings/pages/view-bookings/view-bookings').then(
      //       (m) => m.ViewBooking
      //     ),
      //   canMatch: [AuthGuard, LandlordGuard],
      // },
      {
        path: 'properties',
        loadComponent: () =>
          import('../properties/pages/all-properties/all-properties').then(
            (m) => m.AllProperties
          ),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'properties/:id',
        loadComponent: () =>
          import('../properties/pages/view-property/view-property').then(
            (m) => m.ViewProperty
          ),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'property-listings',
        loadComponent: () =>
          import(
            '../property-listing/pages/all-property-listing/all-property-listing'
          ).then((m) => m.AllPropertyListing),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'property-listings/:id',
        loadComponent: () =>
          import(
            '../property-listing/pages/view-property-listing/view-property-listing'
          ).then((m) => m.ViewPropertyListing),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'listings/:id/edit',
        loadComponent: () =>
          import(
            '../property-listing/pages/manage-property-listing/manage-property-listing'
          ).then((m) => m.ManagePropertyListing),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'addresses',
        loadComponent: () =>
          import('../customer/components/addresses/addresses').then(
            (m) => m.Addresses
          ),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/analytics/analytics').then(
            (m) => m.Analytics
          ),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./pages/messages/messages').then((m) => m.Messages),
        canMatch: [AuthGuard, LandlordGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings').then((m) => m.SettingsComponent),
        canMatch: [AuthGuard, LandlordGuard],
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full',
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./pages/settings/landlord-profile/landlord-profile').then(
                (m) => m.LandlordProfile
              ),
            canMatch: [AuthGuard, LandlordGuard],
          },
          {
            path: 'password',
            loadComponent: () =>
              import('../customer/pages/settings/pages/password/password').then(
                (m) => m.Password
              ),
            canMatch: [AuthGuard, LandlordGuard],
          },
          {
            path: 'billing',
            loadComponent: () =>
              import('../customer/pages/settings/pages/billing/billing').then(
                (m) => m.Billing
              ),
            canMatch: [AuthGuard, LandlordGuard],
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import(
                '../customer/pages/settings/pages/notifications/notifications'
              ).then((m) => m.Notifications),
            canMatch: [AuthGuard, LandlordGuard],
          },
          {
            path: 'documents',
            loadComponent: () =>
              import('./pages/settings/documents/documents').then(
                (m) => m.Documents
              ),
            canMatch: [AuthGuard, LandlordGuard],
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
