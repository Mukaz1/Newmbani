import { ExpressQuery } from '@newmbani/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserQueryData {
  keyword: string;
  page: number;
  skip: number;
  userId?: string;
  tenantId?: string;
  landlordId?: string;
  sort: any;
  email?: string;
  phone?: string;
  roleId?: string;
  limit: number;
  includePassword: boolean;
}
export function getUserQueryParams(payload: {
  query: ExpressQuery;
  totalDocuments: number;
}): UserQueryData {
  const { query, totalDocuments } = payload;
  const limitQ = query.limit ?? 10;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;
  const phone: string | undefined =
    query && query.phone ? (query.phone as string) : undefined;
  const tenantId: string | undefined =
    query && query.tenantId ? (query.tenantId as string) : undefined;
  const includePassword: boolean =
    query && query.includePassword
      ? ((query.includePassword as unknown as boolean) ?? false)
      : false;
  const roleId: string | undefined =
    query && query.roleId ? (query.roleId as string) : undefined;
  const landlordId: string | undefined =
    query && query.landlordId ? (query.landlordId as string) : undefined;
  const email: string | undefined =
    query && query.email ? (query.email as string) : undefined;
  const userId: string | undefined =
    query && query.userId ? (query.userId as string) : undefined;
  const sort =
    query && query.sort
      ? (query.sort as object) || { createdAt: -1 }
      : { createdAt: -1 };
  const skip = limit * (page - 1);

  return {
    keyword,
    limit,
    page,
    email,
    tenantId,
    includePassword,
    userId,
    phone,
    roleId,
    landlordId,
    sort,
    skip,
  };
}
