import { ExpressQuery, User } from '@newmbani/types';

/**
 * Get user ids
 * @param payload
 * @constructor
 */
export function getUserIdsUtil(payload: { user: User; query: ExpressQuery }): {
  tenantId?: string;
  landlordId?: string;
} {
  const { user, query } = payload;

  const queryLandlordId: string | undefined =
    query && query.landlordId
      ? (query.landlordId as string).includes('undefined')
        ? undefined
        : (query.landlordId as string)
      : undefined;

  const queryTenantId: string | undefined =
    query && query.tenantId
      ? (query.tenantId as string).includes('undefined')
        ? undefined
        : (query.tenantId as string)
      : undefined;

  const tenantId: string | undefined = user.tenantId || queryTenantId;
  const landlordId: string | undefined = user.landlordId || queryLandlordId;
  return { tenantId, landlordId };
}
