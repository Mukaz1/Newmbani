/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExpressQuery } from '@newmbani/types';

export interface EmployeeQueryData {
  keyword: string;
  page: number;
  skip: number;
  employeeId?: string;
  sort: any;
  email?: string;
  phone?: string;
  roleId?: string;
  limit: number;
  includePassword: boolean;
}

export function getEmployeeQueryParams(payload: {
  query: ExpressQuery;
  totalDocuments: number;
}): EmployeeQueryData {
  const { query, totalDocuments } = payload;
  const limitQ = query.limit;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;
  const phone: string | undefined =
    query && query.phone ? (query.phone as string) : undefined;

  const includePassword: boolean =
    query && query.includePassword
      ? ((query.includePassword as unknown as boolean) ?? false)
      : false;
  const roleId: string | undefined =
    query && query.roleId ? (query.roleId as string) : undefined;
  const email: string | undefined =
    query && query.email ? (query.email as string) : undefined;

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
    includePassword,
    phone,
    roleId,
    sort,
    skip,
  };
}
