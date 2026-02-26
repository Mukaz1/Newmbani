import { ExpressQuery } from "@newmbani/types";

export interface LandlordQueryPayload {
    keyword: string;
    skip: number;
    page: number;
    limit: number;
    sort: object;
    slim: boolean;
    verified: boolean;
  }

export const getLandlordParams = async (data: {
    query: ExpressQuery;
    totalDocuments: number;
  }): Promise<LandlordQueryPayload> => {
    const { query, totalDocuments } = data;
    const limitQ = query.limit;
    const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
    const keyword = query && query.keyword ? (query.keyword as string) || '' : '';
    const page = query && query.page ? +query.page : 1;
    const skip = limit * (page - 1);
    const sort =
      query && query.sort
        ? (query.sort as object) || { createdAt: -1 }
        : { createdAt: -1 };
    const slim = !!query.slim;
    const verified = !!query.verified;
    return {
      keyword,
      limit,
      page,
      sort,
      skip,
      slim,
      verified,
    };
  };
  