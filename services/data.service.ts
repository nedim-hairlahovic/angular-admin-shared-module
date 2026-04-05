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
  TEntity extends ApiResource,
  TRequest,
> extends BaseCrudService<TEntity> {
  private readonly backendAdapter = inject(ADMIN_BACKEND_ADAPTER);

  abstract getUrlPath(): string;

  private endpoints(): CrudEndpointConvention {
    return this.backendAdapter.crudEndpoints();
  }

  protected buildEntityUrl(id: any): string {
    return this.endpoints().item(this.getUrlPath(), id);
  }

  getCollectionUrl(): string {
    return this.endpoints().collection(this.getUrlPath());
  }

  fetchAll(searchQuery?: string): Observable<TEntity[]> {
    const select = this.endpoints().listConfig;

    if (!select) {
      throw new Error("All endpoint is not configured for this backend.");
    }

    let params = new HttpParams();
    if (searchQuery && select.searchParamKey) {
      params = params.append(select.searchParamKey, searchQuery);
    }

    const url = select.url(this.getUrlPath());

    return this.http.get<any>(url, { params }).pipe(
      map((res) => {
        if (select.responseDataKey == null) {
          return Array.isArray(res) ? res : [];
        }
        return res?.[select.responseDataKey] ?? [];
      }),
    );
  }

  fetchPage(params?: HttpParams): Observable<PagedData<TEntity>> {
    return this.http.get<PagedData<TEntity>>(this.getCollectionUrl(), {
      params,
    });
  }

  create(request: TRequest): Observable<TEntity> {
    return this.http.post<TEntity>(this.getCollectionUrl(), request, {
      headers: this.httpHeaders,
    });
  }

  update(id: string | number, request: TRequest): Observable<TEntity> {
    return this.http.put<TEntity>(this.buildEntityUrl(id), request, {
      headers: this.httpHeaders,
    });
  }

  patch(id: string | number, request: Partial<TRequest>): Observable<TEntity> {
    return this.http.patch<TEntity>(this.buildEntityUrl(id), request, {
      headers: this.httpHeaders,
    });
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(this.buildEntityUrl(id), {
      headers: this.httpHeaders,
    });
  }

  toSearchableSelectItem(entity: TEntity): SearchableSelectItem {
    return {
      label: entity.id,
    } as SearchableSelectItem;
  }

  /**
   * Override in a child service to enable image upload/delete for this resource.
   * - `path`       – URL suffix for POST upload,  e.g. '/logo'
   * - `fieldName`  – FormData field name sent to the backend
   * - `deletePath` – URL suffix for DELETE (optional; omit to disable delete)
   *
   * Example:
   *   protected override imageUploadConfig() {
   *     return { path: '/logo', fieldName: 'file', deletePath: '/logo' };
   *   }
   */
  protected imageUploadConfig(): {
    path: string;
    fieldName: string;
    deletePath?: string;
  } | null {
    return null;
  }

  uploadImage(id: string | number, file: File): Observable<TEntity> {
    const config = this.imageUploadConfig();
    if (!config) {
      throw new Error(
        `${this.constructor.name}: image upload is not configured. Override imageUploadConfig() to enable it.`,
      );
    }
    const fd = new FormData();
    fd.append(config.fieldName, file);
    return this.http.post<TEntity>(this.buildEntityUrl(id) + config.path, fd);
  }

  deleteImage(id: string | number): Observable<void> {
    const config = this.imageUploadConfig();
    if (!config?.deletePath) {
      throw new Error(
        `${this.constructor.name}: image delete is not configured. Add deletePath to imageUploadConfig() to enable it.`,
      );
    }
    return this.http.delete<void>(this.buildEntityUrl(id) + config.deletePath);
  }
}
