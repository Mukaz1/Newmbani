import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-wrapper').then((m) => m.AuthWrapper),
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        children: [
          {
            path: '',
            redirectTo: 'email',
            pathMatch: 'full',
          },
          {
            path: 'email',
            loadComponent: () =>
              import(
                './pages/login-pages/email-and-password/email-and-password'
              ).then((m) => m.EmailAndPassword),
          },
        ],
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            redirectTo: 'customer',
            pathMatch: 'full',
          },
          {
            path: 'customer',
            loadComponent: () =>
              import(
                './pages/registration-pages/register-email-password/register-email-password'
              ).then((m) => m.RegisterEmailPassword),
          },

          {
            path: 'landlord',
            loadComponent: () =>
              import(
                './pages/registration-pages/register-landlord/register-landlord'
              ).then((m) => m.RegisterLandlord),
          },
        ],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/password-pages/forgot-password/forgot-password').then(
            (m) => m.ForgotPassword
          ),
      },
      {
        path: 'update-password/:resetPasswordToken',
        loadComponent: () =>
          import('./pages/password-pages/update-password/update-password').then(
            (m) => m.UpdatePassword
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login/email', pathMatch: 'full' },
];
