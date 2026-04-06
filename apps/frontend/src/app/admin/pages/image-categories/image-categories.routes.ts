import { Routes } from '@angular/router';
import { AdminGuard } from '../../../auth/guards/admin.guard';
import { AuthGuard } from '../../../auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/all-image-categories/all-image-categories').then(
        (m) => m.AllImageCategories,
      ),
    canMatch: [AuthGuard, AdminGuard],
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/manage-image-categories/manage-image-categories').then(
        (m) => m.ManageImageCategories,
      ),
    canMatch: [AuthGuard, AdminGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/view-image-category/view-image-category').then(
        (m) => m.ViewImageCategory,
      ),
    canMatch: [AuthGuard, AdminGuard],
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/manage-image-categories/manage-image-categories').then(
        (m) => m.ManageImageCategories,
      ),
    canMatch: [AuthGuard, AdminGuard],
  },
];
