/* ---------- Pagination ---------- */
export interface Pagination {
  dataKey(): string;
  metaRootKey(): string | null;
  currentPageKey(): string;
  totalPagesKey(): string;
  totalElementsKey(): string;

  requestParams(
    page: number,
    size: number,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
  ): Record<string, any>;
}

/* ---------- Filtering ---------- */
export interface QueryFilter {
  search?: {
    key: string;
    value: string;
  };
  // future: fields, ranges, enums, etc.
}

/* ---------- Errors ---------- */
export interface BackendError {
  code?: string;
  message?: string;
  params?: Record<string, unknown>;
  fieldErrors?: Record<string, BackendFieldError>;
}

export interface BackendFieldError {
  code?: string;
  message?: string;
  params?: Record<string, unknown>;
}

/* ---------- Paging result ---------- */
export interface PagedData<T> {
  items: T[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  last: boolean;
}
