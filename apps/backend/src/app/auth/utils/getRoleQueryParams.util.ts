import { ExpressQuery } from '@newmbani/types';

export interface RoleQueryData {
  keyword: string;
  page: number;
  skip: number;
  limit: number;
  sort: any;
  roleId?: string;
}

export function getRoleParams(data: {
  query: ExpressQuery;
  totalDocuments: number;
}): RoleQueryData {
  const { query, totalDocuments } = data;
  const limitQ = query.limit;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;
  const roleId: string | undefined =
    query && query.roleId ? (query.roleId as string) : undefined;
  const sort =
    query && query.sort
      ? (query.sort as object) || { createdAt: -1 }
      : { createdAt: -1 };
  const skip = limit * (page - 1);
  return {
    keyword,
    page,
    skip,
    limit,
    sort,
    roleId,
  };
}
