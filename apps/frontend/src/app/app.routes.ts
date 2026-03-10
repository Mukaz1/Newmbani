import { Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { CustomerGuard } from './auth/guards/customer.guard';
import { Error404 } from './common/errors/error-404/error-404';
import { Error500 } from './common/errors/error-500/error-500';
import { LandlordGuard } from './auth/guards/landlord.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./marketplace/marketplace.routes').then((m) => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },

  {
    path: 'portal-index',
    loadComponent: () =>
      import('./portal-index/portal-index').then((m) => m.PortalIndex),
    canMatch: [AuthGuard],
  },
  {
    path: 'customer',
    canMatch: [AuthGuard, CustomerGuard],
    loadChildren: () => import('./customer/routes').then((m) => m.routes),
  },
  {
    path: 'landlord',
    canMatch: [AuthGuard, LandlordGuard],
    loadChildren: () => import('.//landlords/routes').then((m) => m.routes),
  },
  {
    path: 'admin',
    canMatch: [AuthGuard, AdminGuard],
    loadChildren: () => import('./admin/admin.routes').then((m) => m.routes),
  },
  {
    path: 'not-found',
    component: Error404,
  },
  {
    path: 'serve-error',
    component: Error500,
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
