import { ExpressQuery } from '@newmbani/types';

export interface CustomerQueryData {
  keyword: string;
  page: number;
  skip: number;
  sort: any;
  limit: number;
  email?: string;
  phone?: string;
  customerId?: string;
  countryId?: string;
}

export function getCustomerQueryParams(payload: {
  query: ExpressQuery;
  totalDocuments: number;
}): CustomerQueryData {
  const { query, totalDocuments } = payload;

  const limitQ = query.limit ?? 10;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword = query?.keyword ? (query.keyword as string) : '';
  const page = query?.page ? +query.page : 1;
  const skip = limit * (page - 1);

  const email = query?.email ? (query.email as string) : undefined;
  const phone = query?.phone ? (query.phone as string) : undefined;
  const customerId = query?.customerId ? (query.customerId as string) : undefined;
  const countryId = query?.countryId ? (query.countryId as string) : undefined;

  const sort =
    query?.sort && typeof query.sort === 'object'
      ? query.sort
      : { createdAt: -1 };

  return {
    keyword,
    page,
    skip,
    sort,
    limit,
    email,
    phone,
    customerId,
    countryId,
  };
}
