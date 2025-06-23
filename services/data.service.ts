import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { environment } from "src/environments/environment";
import { Page } from "../models/page";
import { ApiResource } from "../models/api-resource";
import { SearchableSelectItem } from "../models/searchable-select-item";

@Injectable({
  providedIn: "root",
})
export abstract class DataCrudService<T extends ApiResource, R> {
  private readonly baseUrl = `${environment.backendUrl}/api/v1/admin`;
  private readonly httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(private http: HttpClient) {}

  abstract getUrlPath(): string;
  abstract initializeItem(): T;

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

  getSingleItem(id: any): Observable<T> {
    if (id === 0 || id === "0") {
      return of(this.initializeItem());
    }

    const url = `${this.getCommonUrl()}/${id}`;
    return this.http.get<T>(url);
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
