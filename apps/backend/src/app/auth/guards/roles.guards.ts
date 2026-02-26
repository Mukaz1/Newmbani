// roles.guard.ts
import {
    Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesGuard  {
    // constructor(private reflector: Reflector) { }

    // canActivate(context: ExecutionContext): boolean {
    //     const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
    //         context.getHandler(),
    //         context.getClass(),
    //     ]);

    //     if (!requiredRoles || requiredRoles.length === 0) {
    //         return true;
    //     }

    //     const { user } = context.switchToHttp().getRequest();

    //     if (!user || !requiredRoles.includes(user.role)) {
    //         throw new ForbiddenException('Insufficient role to access this resource');
    //     }

    //     return true;
    // }
}
