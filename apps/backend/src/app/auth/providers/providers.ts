import { PermissionModel } from '../schemas/permissions.schema';
import { RoleModel } from '../schemas/roles.schema';
import { DatabaseModelEnums } from '@newmbani/types';
import { UserModel } from '../schemas/user.schema';

export const authProviders = [
  {
    provide: DatabaseModelEnums.PERMISSION,
    useFactory: () => PermissionModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.ROLE,
    useFactory: () => RoleModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
  {
    provide: DatabaseModelEnums.USER,
    useFactory: () => UserModel,
    inject: [DatabaseModelEnums.DATABASE_CONNECTION],
  },
];
