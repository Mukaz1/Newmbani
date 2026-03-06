import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./all-customers/all-customers').then((c) => c.AllCustomers),
      },

      {
        path: 'create',
        loadComponent: () =>
          import('./create-customer/create-customer').then(
            (c) => c.CreateCustomer
          ),
      },

      {
        path: ':id',
        loadComponent: () =>
          import('./view-customer/view-customer').then((c) => c.ViewCustomer),
      },

      {
        path: ':id/edit',
        loadComponent: () =>
          import('./edit-customer/edit-customer').then((c) => c.EditCustomer),
      },
    ],
  },
];
