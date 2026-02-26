import { ExpressQuery, PropertyApprovalStatus } from '@newmbani/types';
import { PropertyAggregationPayload } from '../queries/properties.query';

export async function getPropertyQueryParams(
  query: ExpressQuery,
  totalDocuments: number,
): Promise<PropertyAggregationPayload> {
  const slug = query.slug ? (query.slug as string) : undefined;
  const propertyId = query.propertyId
    ? (query.propertyId as string)
    : undefined;
  const limitQ = query.limit;
  const limit =
    +limitQ === -1
      ? totalDocuments > 0
        ? totalDocuments
        : 20
      : +query.limit || 20;
  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;
  const minPrice: number | undefined =
    query && query.minPrice ? +query.minPrice || undefined : undefined;
  const maxPrice: number | undefined =
    query && query.maxPrice ? +query.maxPrice || undefined : undefined;
  // get the host id
  const landlordId: string | undefined =
    query && query.landlordId
      ? (query.landlordId as string).includes('undefined')
        ? undefined
        : (query.landlordId as string)
      : undefined;

  // get the rating
  const rating: number | undefined =
    query && query.rating
      ? (query.rating as string).includes('undefined')
        ? undefined
        : +(query.rating as string)
      : undefined;
  // get propertyAvailability param
  const isAvailable: boolean | undefined =
    query && query.isAvailable
      ? (query.isAvailable as string).includes('undefined')
        ? undefined
        : (query.isAvailable as unknown as boolean)
      : undefined;

  // prepare category Id
  const categoryId: string | undefined =
    query && query.categoryId
      ? (query.categoryId as string).includes('undefined')
        ? undefined
        : (query.categoryId as string)
      : undefined;
  const skip = limit * (page - 1);
  const sort =
    query && query.sort ? { ...(query.sort as any) } : { createdAt: -1 };
  // prepare subcategory Id
  const approvalStatus: PropertyApprovalStatus | undefined =
    query && query.approvalStatus
      ? (query.approvalStatus as string).includes('undefined')
        ? undefined
        : (query.approvalStatus as PropertyApprovalStatus)
      : undefined;

  return {
    slug,
    propertyId,
    keyword,
    limit,
    sort,
    page,
    landlordId,
    rating,
    isAvailable,
    categoryId,
    skip,
    maxPrice,
    minPrice,
    approvalStatus,
  };
}
