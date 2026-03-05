/**
 * Confirms if the user has the required permissions.
 *
 * @param permissions - The permissions assigned to the user.
 * @param requiredPermissions - The required permissions to check.
 * @returns True if the user has all the required permissions, false otherwise.
 */
export function confirmPermissions(
  permissions: string[],
  requiredPermissions: string[]
) {
  if (!requiredPermissions) {
    return true;
  }
  if (!permissions) {
    return false;
  }
  // check if the user has the right permissions
  return requiredPermissions.some((permission) => {
    const canAccess = permissions.includes(permission);
    return canAccess;
  });
}
