import { PaginatedData } from '@newmbani/types';

export const getNextPageCount = (payload: {
  currentPage: number;
  paginatedData: PaginatedData;
}): {
  startItemCount: number;
  nextPageItemCount: number;
  endItemCount: number;
} => {
  const { currentPage, paginatedData } = payload;

  // compute the first item to display
  const startItemCount =
    currentPage === 1 ? 1 : paginatedData.limit * (currentPage - 1) + 1;

  // compute the first item to display
  const nextPageItemCount =
    currentPage < 2 ? paginatedData.limit : paginatedData.limit * currentPage;

  // compute the last item to display
  const endItemCount =
    currentPage === paginatedData.pages
      ? paginatedData.total
      : paginatedData.limit * (currentPage - 1) + paginatedData.limit;

  return {
    startItemCount,
    nextPageItemCount,
    endItemCount,
  };
};
