import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./all-employee/all-employee').then(
            (c) => c.AllEmployee
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./create-employee/create-employee').then(
            (c) => c.CreateEmployee
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./view-employee/view-employee').then(
            (c) => c.ViewEmployee
          ),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./edit-employee/edit-employee').then(
            (c) => c.EditEmployee
          ),
      },
    ],
  },
];
