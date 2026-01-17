import { HttpErrorResponse } from "@angular/common/http";
import { InjectionToken } from "@angular/core";

import {
  BackendError,
  CrudEndpointConvention,
  Pagination,
  QueryFilter,
} from "./backend-types";

export interface BackendAdapter {
  crudEndpoints(): CrudEndpointConvention;
  pagination(): Pagination;
  mapError(err: HttpErrorResponse): BackendError | null;
  buildFilterParams(filter: QueryFilter): Record<string, any>;
}

export const ADMIN_BACKEND_ADAPTER = new InjectionToken<BackendAdapter>(
  "ADMIN_BACKEND_ADAPTER",
);
