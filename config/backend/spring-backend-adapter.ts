import { HttpErrorResponse } from "@angular/common/http";

import { BaseBackendAdapter } from "./base-backend-adapter";
import {
  BackendError,
  CrudEndpointConvention,
  Pagination,
} from "./backend-types";

export class SpringBackendAdapter extends BaseBackendAdapter {
  protected readonly paginationImpl = new SpringPagination();

  override crudEndpoints(): CrudEndpointConvention {
    return this.createRestCrudConvention({
      selectList: {
        url: (p, base) => `${base}${p}/all`,
        searchParamKey: "search",
        responseDataKey: null,
      },
    });
  }

  mapError(err: HttpErrorResponse): BackendError | null {
    const dto = err.error as any;
    if (!dto || typeof dto !== "object") return null;

    const fieldErrors = dto.fieldErrors
      ? Object.fromEntries(
          Object.entries(dto.fieldErrors).map(([field, fe]: any) => [
            field,
            { code: fe?.code, message: fe?.message, params: fe?.params },
          ]),
        )
      : undefined;

    return {
      code: dto.code,
      message: dto.message,
      params: dto.params,
      fieldErrors,
    };
  }
}

class SpringPagination implements Pagination {
  dataKey(): string {
    return "content";
  }

  metaRootKey(): string | null {
    return null; // top-level
  }

  currentPageKey(): string {
    return "currentPage";
  }

  totalPagesKey(): string {
    return "totalPages";
  }

  totalElementsKey(): string {
    return "totalElements";
  }

  requestParams(
    page: number,
    size: number,
    sortBy?: string,
    sortOrder?: "ASC" | "DESC",
  ): Record<string, any> {
    const params: any = { page, size };

    if (sortBy && sortOrder) {
      params.sort = `${sortBy},${sortOrder}`;
    }

    return params;
  }
}
