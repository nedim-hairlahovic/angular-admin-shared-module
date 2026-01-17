import { HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";

import { BackendAdapter } from "./backend-adapter";
import {
  BackendError,
  CrudEndpointConvention,
  Pagination,
  QueryFilter,
} from "./backend-types";
import { ADMIN_SHARED_CONFIG } from "../admin-shared-config";

export abstract class BaseBackendAdapter implements BackendAdapter {
  protected readonly cfg = inject(ADMIN_SHARED_CONFIG);

  protected abstract readonly paginationImpl: Pagination;

  abstract crudEndpoints(): CrudEndpointConvention;

  protected baseApiUrl(): string {
    return `${this.cfg.backend.url}${this.cfg.backend.apiBasePath}`;
  }

  protected createRestCrudConvention(options?: {
    selectList?: {
      url: (path: string, base: string) => string;
      searchParamKey?: string;
      responseDataKey?: string | null;
    };
  }): CrudEndpointConvention {
    const base = this.baseApiUrl();

    const convention: CrudEndpointConvention = {
      collection: (p) => `${base}${p}`,
      item: (p, id) => `${base}${p}/${id}`,
    };

    if (options?.selectList) {
      convention.selectList = {
        url: (p) => options.selectList!.url(p, base),
        searchParamKey: options.selectList.searchParamKey,
        responseDataKey: options.selectList.responseDataKey,
      };
    }

    return convention;
  }

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
