import { Permission } from '@newmbani/types';

export function groupPermissionsByCategory(permissions: Permission[]) {
  return permissions.reduce(
    (groups, permission) => {
      const { category } = permission;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
      return groups;
    },
    {} as Record<string, Permission[]>,
  );
}
