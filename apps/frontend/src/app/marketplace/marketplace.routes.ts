import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./marketplace-layout').then((m) => m.MarketplaceLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/homepage/homepage').then((m) => m.Homepage),
      },
      {
        path: 'portal-index',
        loadComponent: () =>
          import('../portal-index/portal-index').then((m) => m.PortalIndex),
      },
      {
        path: 'what-we-offer',
        loadComponent: () =>
          import('./pages/integrations/integrations').then(
            (m) => m.Integrations
          ),
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/contact-us/contact-us').then((m) => m.ContactUs),
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./pages/about-us/about-us').then((m) => m.AboutUs),
      },
     
      {
        path: 'listings',
        loadComponent: () =>
          import('./pages/properties/all-properties/all-properties').then(
            (m) => m.AllListings
          ),
      },
      {
        path: 'listings/:id',
        loadComponent: () =>
          import('./pages/properties/property-detail/property-detail').then(
            (m) => m.ListingDetail
          ),
      },
      {
        path: 'listings/:id/images',
        loadComponent: () =>
          import(
            './pages/properties/components/view-images-modal/view-images-modal'
          ).then((m) => m.ViewImagesModal),
      },
      {
        path: 'pay/:bookingId',
        loadComponent: () => import('./pages/pay/pages/pay').then((m) => m.Pay),
        canActivate: [AuthGuard],
      },
     
    ],
  },
];
