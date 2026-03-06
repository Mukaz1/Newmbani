import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'required-documents',
    loadComponent: () =>
      import('./required-documents').then((c) => c.RequiredDocuments),
  },
];
