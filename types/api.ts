// Standard API Response Wrapper
export interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  data: T;
  errors: any | null;
}

// Standard Paginated Data Wrapper
export interface PaginatedList<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T[];
}
