import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BaseCrudService } from "./base-crud.service";

@Injectable({
  providedIn: "root",
})
export abstract class NestedDataService<
  T,
  R,
  ID = number
> extends BaseCrudService<T> {
  constructor(protected override http: HttpClient) {
    super(http);
  }

  abstract getCommonUrl(parentId: ID): string;

  protected buildItemUrl(parentId: ID, childId: any): string {
    return `${this.getCommonUrl(parentId)}/${childId}`;
  }

  getItems(parentId: ID): Observable<T[]> {
    const url = this.getCommonUrl(parentId);
    return this.http.get<T[]>(url);
  }

  createItem(parentId: ID, request: R): Observable<T> {
    return this.http.post<T>(this.getCommonUrl(parentId), request, {
      headers: this.httpHeaders,
    });
  }

  updateItem(parentId: ID, childId: any, request: R): Observable<T> {
    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.put<T>(url, request, { headers: this.httpHeaders });
  }

  deleteItem(parentId: ID, childId: any): Observable<{}> {
    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders });
  }
}
