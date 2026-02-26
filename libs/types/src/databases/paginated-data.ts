export interface Periods {
  year: number;
  months: { month: string; value: number }[];
}
export interface PaginatedData<T = any> {
  page: number;
  limit: number;
  total: number;
  pages: number;
  data: T;
  filters?: {
    months?: Periods[];
  };
}
