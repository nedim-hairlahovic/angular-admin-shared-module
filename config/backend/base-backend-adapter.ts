import { HttpErrorResponse } from "@angular/common/http";

import { BackendAdapter } from "./backend-adapter";
import { BackendError, Pagination, QueryFilter } from "./backend-types";

export abstract class BaseBackendAdapter implements BackendAdapter {
  protected abstract readonly paginationImpl: Pagination;

  pagination(): Pagination {
    return this.paginationImpl;
  }

  buildFilterParams(filter: QueryFilter): Record<string, any> {
    const params: Record<string, any> = {};

    if (filter.search?.value) {
      params[filter.search.key] = filter.search.value;
    }

    return params;
  }

  abstract mapError(err: HttpErrorResponse): BackendError | null;
}
