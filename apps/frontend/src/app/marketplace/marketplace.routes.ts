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
        path: 'aluxe',
        loadComponent: () =>
          import('./pages/services/services').then((m) => m.Services),
      },
      {
        path: 'aluxe/:id',
        loadComponent: () =>
          import('./components/service-details/service-details').then(
            (m) => m.ServiceDetails
          ),
      },
      {
        path: 'listings',
        loadComponent: () =>
          import('./pages/listings/all-listings/all-listings').then(
            (m) => m.AllListings
          ),
      },
      {
        path: 'listings/:id',
        loadComponent: () =>
          import('./pages/listings/listing-detail/listing-detail').then(
            (m) => m.ListingDetail
          ),
      },
      {
        path: 'listings/:id/images',
        loadComponent: () =>
          import(
            './pages/listings/components/view-images-modal/view-images-modal'
          ).then((m) => m.ViewImagesModal),
      },
      {
        path: 'pay/:bookingId',
        loadComponent: () => import('./pages/pay/pages/pay').then((m) => m.Pay),
        canActivate: [AuthGuard],
      },
      {
        path: 'design-build',
        loadComponent: () =>
          import(
            './pages/design-and-build/pages/design-and-build/design-and-build'
          ).then((m) => m.DesignAndBuild),
      },

      {
        path: 'support-center',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'topic/:topicSlug',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'topic/:topicSlug/subtopic/:subtopicSlug',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'faqs',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'returns',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'hosts',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'payment',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'refund-cancellation',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'terms-conditions',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'third-party',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'about',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
          {
            path: 'privacy-policy',
            loadComponent: () =>
              import('./pages/support-center/helpcenter').then(
                (m) => m.HelpCenter
              ),
          },
        ],
      },
    ],
  },
];
