import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/hosts/hosts').then((c) => c.Hosts),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/view-host/view-host').then((c) => c.ViewHost),
  },
];
