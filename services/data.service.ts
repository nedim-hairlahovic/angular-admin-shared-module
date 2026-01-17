import { HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ApiResource } from "../models/api-resource";
import { SearchableSelectItem } from "../models/searchable-select-item";
import { BaseCrudService } from "./base-crud.service";
import {
  CrudEndpointConvention,
  PagedData,
} from "../config/backend/backend-types";
import { ADMIN_BACKEND_ADAPTER } from "../config";

@Injectable({
  providedIn: "root",
})
export abstract class DataCrudService<
  T extends ApiResource,
  R,
> extends BaseCrudService<T> {
  private readonly backendAdapter = inject(ADMIN_BACKEND_ADAPTER);

  abstract getUrlPath(): string;

  private endpoints(): CrudEndpointConvention {
    return this.backendAdapter.crudEndpoints();
  }

  protected buildItemUrl(id: any): string {
    return this.endpoints().item(this.getUrlPath(), id);
  }

  getCommonUrl(): string {
    return this.endpoints().collection(this.getUrlPath());
  }

  getSelectItems(searchQuery?: string): Observable<T[]> {
    const select = this.endpoints().selectList;

    if (!select) {
      throw new Error(
        "Select list endpoint is not configured for this backend.",
      );
    }

    let params = new HttpParams();
    if (searchQuery && select.searchParamKey) {
      params = params.append(select.searchParamKey, searchQuery);
    }

    return this.http.get<any>(select.url(this.getUrlPath()), { params }).pipe(
      map((res) => {
        if (select.responseDataKey == null) {
          return Array.isArray(res) ? res : [];
        }

        return res?.[select.responseDataKey] ?? [];
      }),
    );
  }

  getPagedItems(params?: HttpParams): Observable<PagedData<T>> {
    return this.http.get<PagedData<T>>(this.getCommonUrl(), { params });
  }

  createItem(request: R): Observable<T> {
    return this.http.post<T>(this.getCommonUrl(), request, {
      headers: this.httpHeaders,
    });
  }

  updateItem(id: any, request: R): Observable<T> {
    const url = this.buildItemUrl(id);
    return this.http.put<T>(url, request, { headers: this.httpHeaders });
  }

  patchItem(id: any, request: Partial<R>): Observable<T> {
    const url = this.buildItemUrl(id);
    return this.http.patch<T>(url, request, {
      headers: this.httpHeaders,
    });
  }

  deleteItem(id: any): Observable<{}> {
    const url = this.buildItemUrl(id);
    return this.http.delete<any>(url, {
      headers: this.httpHeaders,
    });
  }

  convertToSearchableItem(item: T): SearchableSelectItem {
    return {
      label: item.id,
    } as SearchableSelectItem;
  }
}
