import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '@newmbani/types';

export const RequiredPermissions = (
  permissions: PermissionEnum[] | PermissionEnum,
  mode: 'any' | 'all' = 'any'
) =>
  SetMetadata('permissions', {
    permissions: Array.isArray(permissions) ? permissions : [permissions],
    mode,
  });