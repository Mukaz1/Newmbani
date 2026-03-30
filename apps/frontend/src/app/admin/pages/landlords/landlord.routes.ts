import { Routes } from '@angular/router';
import { AdminGuard } from '../../../auth/guards/admin.guard';
import { AuthGuard } from '../../../auth/guards/auth.guard';

export const routes: Routes = [
      {
        path: '',
        loadComponent: () =>
          import('./pages/landlords/landlords').then(
            (m) => m.Landlords
          ),
        canMatch: [AuthGuard, AdminGuard],
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/view-landlords/view-landlord').then(
            (m) => m.ViewLandlord
          ),
        canMatch: [AuthGuard, AdminGuard],
      }

];
