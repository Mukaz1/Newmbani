import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../../auth/services/permission.service';

export function permissionGuard(required: string | string[]): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    const permissions = Array.isArray(required) ? required : [required];
    const hasAccess = permissionService.hasAny(permissions);

    if (!hasAccess) {
      router.navigateByUrl('/forbidden'); // or redirect anywhere
      return false;
    }
    return true;
  };
}