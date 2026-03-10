import { Routes } from '@angular/router';
import { PermissionEnum } from '@newmbani/types';
import { AuthGuard } from '../auth/guards/auth.guard';
import { permissionGuard } from '../common/guards/permissions.guard';

export const routes: Routes = [
  {
    path: 'categories',
    children: [
      {
        path: '',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_PROPERTY_CATEGORIES,PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import(
            './pages/property-categories-list/property-categories-list'
          ).then((m) => m.PropertyCategoriesList),
      },
      {
        path: 'create',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.CREATE_PROPERTY_CATEGORY,PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import(
            './pages/add-property-category/add-property-category'
          ).then((m) => m.AddPropertyCategory),
      },
      {
        path: ':id',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_PROPERTY_CATEGORY,PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import('./pages/view-property-category/view-property-category').then(
            (m) => m.ViewPropertyCategory
          ),
      },
      {
        path: ':id/edit',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.UPDATE_PROPERTY_CATEGORY, PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import('./pages/edit-property-category/edit-property-category').then(
            (m) => m.EditPropertyCategory
          ),
        data: { permissions: [] },
      },
    ],
  },

  {
    path: 'subcategories',
    children: [
      {
        path: '',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_PROPERTY_CATEGORIES,PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import(
            './pages/property-subcategories-list/property-subcategories-list'
          ).then((c) => c.PropertieSubcategoriesList),
      },
      {
        path: ':id',
        canActivate: [AuthGuard, permissionGuard([PermissionEnum.VIEW_PROPERTY_CATEGORY, PermissionEnum.MANAGE_PROPERTY_CATEGORIES])],
        loadComponent: () =>
          import(
            './pages/view-property-sub-category/view-property-sub-category'
          ).then((m) => m.ViewPropertySubcategory),
      },
    ],
  },
];
