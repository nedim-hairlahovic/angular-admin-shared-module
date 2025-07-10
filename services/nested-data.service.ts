import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export abstract class NestedDataService<T, R, ID = number> {
  protected readonly baseUrl = `${environment.backendUrl}/api/v1/admin`;
  private readonly httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(protected http: HttpClient) {}

  abstract initializeItem(): T;
  abstract getCommonUrl(parentId: ID): string;

  getItems(parentId: ID): Observable<T[]> {
    const url = this.getCommonUrl(parentId);
    return this.http.get<T[]>(url);
  }

  getSingleItem(parentId: ID, childId: any): Observable<T> {
    if (childId === 0 || childId === "0") {
      return of(this.initializeItem());
    }

    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.get<T>(url);
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
