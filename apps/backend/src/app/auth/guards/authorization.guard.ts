import {
  Injectable,
} from '@nestjs/common';
import { PermissionEnum } from '@newmbani/types';

export interface PermissionMetadata {
  permissions: PermissionEnum[];
  mode?: 'any' | 'all';
}


@Injectable()
export class AuthorizationGuard  {
  // constructor(
  //   private readonly reflector: Reflector,
  //   private readonly usersService: UsersService
  // ) {}

  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const metadata = this.reflector.getAllAndOverride<PermissionMetadata>(
  //     'permissions',
  //     [context.getHandler(), context.getClass()]
  //   );

  //   if (!metadata?.permissions?.length) return true;

  //   const { permissions: required, mode = 'any' } = metadata;
  //   const request = context.switchToHttp().getRequest();
  //   const user = request.user;

  //   if (!user) throw new ForbiddenException('User not authenticated');

  //   const dbUser = await this.usersService.findOne({ email: user.email });
  //   const userPermissions: string[] = dbUser?.data?.role?.permissions ?? [];

  //   // ✅ instantly allow Super Admin
  //   if (userPermissions.includes(PermissionEnum.MANAGE_ALL)) return true;

  //   const hasAccess =
  //     mode === 'all'
  //       ? required.every((perm) => userPermissions.includes(perm))
  //       : required.some((perm) => userPermissions.includes(perm));

  //   if (!hasAccess)
  //     throw new ForbiddenException('Access denied: insufficient permissions');

  //   return true;
  // }
}
