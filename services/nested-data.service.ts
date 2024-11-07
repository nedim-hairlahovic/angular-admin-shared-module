import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class NestedDataService<T> {
  protected readonly baseUrl = `${environment.backendUrl}/api/v1/admin`;
  private readonly httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(protected http: HttpClient) { }

  abstract initializeItem(): T;
  abstract getCommonUrl(parentId: any): string;

  getItems(parentId: any): Observable<T[]> {
    const url = this.getCommonUrl(parentId);
    return this.http.get<T[]>(url);
  }

  getSingleItem(parentId: any, childId: any): Observable<T> {
    if (childId === 0 || childId === '0') {
      return of(this.initializeItem());
    }

    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.get<T>(url);
  }

  createItem(parentId: any, item: T): Observable<T> {
    return this.http.post<T>(this.getCommonUrl(parentId), item, { headers: this.httpHeaders });
  }

  updateItem(parentId: any, childId: any, item: T): Observable<T> {
    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.put<T>(url, item, { headers: this.httpHeaders });
  }

  deleteItem(parentId: any, childId: any): Observable<{}> {
    const url = `${this.getCommonUrl(parentId)}/${childId}`;
    return this.http.delete<any>(url, { headers: this.httpHeaders });
  }
}
