import { ExpressQuery } from '@newmbani/types';
import { CountryAggregationPayload } from './countries.query';

export async function getCountriesParams(data: {
  query: ExpressQuery;
  totalDocuments: number;
}): Promise<CountryAggregationPayload> {
  const { query, totalDocuments } = data;
  const limitQ = query.limit;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;

  const countryId =
    query && query.countryId
      ? (query.countryId as string) || undefined
      : undefined;
  const supported: boolean | undefined =
    query && query.supported
      ? JSON.parse(query.supported as string) ?? undefined
      : undefined;
  const supportingCustomer: boolean | undefined =
    query && query.supportingCustomer
      ? JSON.parse(query.supportingCustomer as string) ?? undefined
      : undefined;
  const supportingLandlord: boolean | undefined =
    query && query.supportingLandlord
      ? JSON.parse(query.supportingLandlord as string) ?? undefined
      : undefined;

  const skip = limit * (page - 1);
  const sort =
    query && query.sort
      ? (query.sort as object) || { createdAt: -1 }
      : { createdAt: -1 };
  return {
    keyword,
    limit,
    countryId,
    page,
    sort,
    skip,
    // Support
    supported,
    supportingCustomer,
    supportingLandlord,
  };
}
