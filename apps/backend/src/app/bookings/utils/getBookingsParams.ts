import { ExpressQuery } from "@newmbani/types";

export interface BookingQueryPayload {
    keyword: string;
    skip: number;
    page: number;
    limit: number;
    sort: object;
    slim: boolean;
    customerId?:string;
    propertyId?:string;
    landlordId?:string;
  }

export const getBookingParams = async (data: {
    query: ExpressQuery;
    totalDocuments: number;
  }): Promise<BookingQueryPayload> => {
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
    const landlordId: string | undefined =
    query && query.landlordId
      ? (query.landlordId as string).includes('undefined')
        ? undefined
        : (query.landlordId as string)
      : undefined;
      const customerId: string | undefined =
      query && query.customerId
        ? (query.customerId as string).includes('undefined')
          ? undefined
          : (query.customerId as string)
        : undefined;
        const propertyId: string | undefined =
        query && query.propertyId
          ? (query.propertyId as string).includes('undefined')
            ? undefined
            : (query.propertyId as string)
          : undefined;
    
  
    return {
      keyword,
      limit,
      page,
      sort,
      skip,
      slim,
      landlordId,
      propertyId,
      customerId
    };
  };
  