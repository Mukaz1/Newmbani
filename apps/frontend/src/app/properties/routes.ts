import { Routes } from '@angular/router';
import { LandlordGuard } from '../auth/guards/landlord.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canMatch: [AuthGuard, LandlordGuard],
        children: [

            {
                path: '',
                loadComponent: () =>
                import('../properties/pages/all-properties/all-properties').then(
                    (m) => m.AllProperties
                ),
                canMatch: [AuthGuard, LandlordGuard],
            },
            {
                path: 'create',
                loadComponent: () =>
                import('../properties/pages/manage-properties/manage-properties').then(
                    (m) => m.ManageProperty
                ),
                canMatch: [AuthGuard, LandlordGuard],
            },
            {
                path: ':id',
                loadComponent: () =>
                import('../properties/pages/view-property/view-property').then(
                    (m) => m.ViewProperty
                ),
                canMatch: [AuthGuard, LandlordGuard],
            },
            {
                path: ':id/edit',
                loadComponent: () =>
                import('../properties/pages/manage-properties/manage-properties').then(
                    (m) => m.ManageProperty
                ),
                canMatch: [AuthGuard, LandlordGuard],
            },
]}
];
