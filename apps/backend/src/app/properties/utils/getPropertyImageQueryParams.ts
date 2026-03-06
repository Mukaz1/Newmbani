import { ExpressQuery } from '@newmbani/types';
import { PropertyImageAggregationPayload } from '../queries/property-image.aggregator';

export function getPropertyImageQueryParams(
  query: ExpressQuery,
  totalDocuments: number
): PropertyImageAggregationPayload {
  const propertyImageId =
    query && query.propertyImageId
      ? (query.propertyImageId as string)
      : undefined;

  const propertyImageCategoryId =
    query && query.propertyImageCategoryId
      ? (query.propertyImageCategoryId as string)
      : undefined;

  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';

  const limitQ = query && query.limit;
  const limit =
    +limitQ === -1
      ? totalDocuments > 0
        ? totalDocuments
        : 20
      : +query.limit || 20;

  const page = query && query.page ? +query.page : 1;

  const skip = limit * (page - 1);

  const sort =
    query && query.sort ? { ...(query.sort as any) } : { createdAt: -1 };

  return {
    keyword,
    limit,
    skip,
    sort,
    propertyImageId,
    propertyImageCategoryId,
  };
}
