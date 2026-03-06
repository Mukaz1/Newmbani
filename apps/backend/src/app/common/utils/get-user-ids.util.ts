import { ExpressQuery, User } from '@newmbani/types';

/**
 * Get user ids
 * @param payload
 * @constructor
 */
export function getUserIdsUtil(payload: { user: User; query: ExpressQuery }): {
  customerId?: string;
  landlordId?: string;
} {
  const { user, query } = payload;

  const queryLandlordId: string | undefined =
    query && query.landlordId
      ? (query.landlordId as string).includes('undefined')
        ? undefined
        : (query.landlordId as string)
      : undefined;

  const queryCustomerId: string | undefined =
    query && query.customerId
      ? (query.customerId as string).includes('undefined')
        ? undefined
        : (query.customerId as string)
      : undefined;

  const customerId: string | undefined = user.customerId || queryCustomerId;
  const landlordId: string | undefined = user.landlordId || queryLandlordId;
  return { customerId, landlordId };
}
