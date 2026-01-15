import { HttpErrorResponse } from "@angular/common/http";

import { BackendError, BackendFieldError, Pagination } from "./backend-types";
import { BaseBackendAdapter } from "./base-backend-adapter";

export class LaravelBackendAdapter extends BaseBackendAdapter {
  protected readonly paginationImpl = new LaravelPagination();

  mapError(err: HttpErrorResponse): BackendError | null {
    const dto = err.error as any;
    if (!dto || typeof dto !== "object") return null;

    const fieldErrors: Record<string, BackendFieldError> | undefined =
      dto.errors && typeof dto.errors === "object"
        ? Object.fromEntries(
            Object.entries(dto.errors).map(([field, msgs]: any) => [
              field,
              { message: Array.isArray(msgs) ? msgs[0] : String(msgs) },
            ])
          )
        : undefined;

    return {
      code: dto.code,
      message: dto.message,
      fieldErrors,
    };
  }
}

class LaravelPagination implements Pagination {
  dataKey(): string {
    return "data";
  }

  metaRootKey(): string | null {
    return "pagination";
  }

  currentPageKey(): string {
    return "page";
  }

  totalPagesKey(): string {
    return "totalPages";
  }

  totalElementsKey(): string {
    return "totalItems";
  }

  requestParams(
    page: number,
    size: number,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC"
  ): Record<string, any> {
    const params: any = {
      page,
      per_page: size,
    };

    if (sortBy && sortOrder) {
      params.sort = `${sortBy},${sortOrder.toLowerCase()}`; // id,asc
    }

    return params;
  }
}
