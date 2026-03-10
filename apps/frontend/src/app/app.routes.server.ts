import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'customer/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'landlord/**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'pay/*',
    renderMode: RenderMode.Client,
  },
  {
    path: 'checkout/**',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
