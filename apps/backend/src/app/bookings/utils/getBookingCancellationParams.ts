import { ExpressQuery } from '@newmbani/types';

export interface BookingCancellationQueryPayload {
  keyword: string;
  skip: number;
  page: number;
  limit: number;
  sort: object;
  slim: boolean;
  bookingId?: string;
}

export const getBookingCancellationParams = async (data: {
  query: ExpressQuery;
  totalDocuments: number;
}): Promise<BookingCancellationQueryPayload> => {
  const { query, totalDocuments } = data;
  const limitQ = query.limit;
  const limit = +limitQ === -1 ? totalDocuments : +query.limit || 10;
  const keyword =
    query && query.keyword ? (query.keyword as string) || '' : '';
  const page = query && query.page ? +query.page : 1;
  const skip = limit * (page - 1);
  const sort =
    query && query.sort
      ? (query.sort as object) || { createdAt: -1 }
      : { createdAt: -1 };
  const slim = !!query.slim;
  const bookingId =
    query && query.bookingId ? (query.bookingId as string) : undefined;

  return {
    keyword,
    limit,
    page,
    sort,
    skip,
    slim,
    bookingId,
  };
};
