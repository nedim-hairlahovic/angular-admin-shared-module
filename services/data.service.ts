import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { Page } from "../models/page";
import { ApiResource } from "../models/api-resource";
import { SearchableSelectItem } from "../models/searchable-select-item";
import { BaseCrudService } from "./base-crud.service";

@Injectable({
  providedIn: "root",
})
export abstract class DataCrudService<
  T extends ApiResource,
  R
> extends BaseCrudService<T> {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  abstract getUrlPath(): string;

  protected buildItemUrl(id: any): string {
    return `${this.baseUrl}${this.getUrlPath()}/${id}`;
  }

  getCommonUrl(): string {
    return `${this.baseUrl}${this.getUrlPath()}`;
  }

  getAllItems(searchQuery?: string): Observable<T[]> {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append("search", searchQuery);
    }

    const url = `${this.getCommonUrl()}/all`;
    return this.http.get<T[]>(url, { params });
  }

  getPagedItems(params?: HttpParams): Observable<Page<T>> {
    return this.http.get<Page<T>>(this.getCommonUrl(), { params });
  }

  createItem(request: R): Observable<T> {
    return this.http.post<T>(this.getCommonUrl(), request, {
      headers: this.httpHeaders,
    });
  }

  updateItem(id: any, request: R): Observable<T> {
    const url = `${this.getCommonUrl()}/${id}`;
    return this.http.put<T>(url, request, { headers: this.httpHeaders });
  }

  patchItem(id: any, request: Partial<R>): Observable<T> {
    const url = `${this.getCommonUrl()}/${id}`;
    return this.http.patch<T>(url, request, {
      headers: this.httpHeaders,
    });
  }

  deleteItem(id: any): Observable<{}> {
    const url = `${this.getCommonUrl()}/${id}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders });
  }

  convertToSearchableItem(item: T): SearchableSelectItem {
    return {
      label: item.id,
    } as SearchableSelectItem;
  }
}
