import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";

import { environment } from "src/environments/environment";

export abstract class BaseCrudService<T> {
  protected readonly baseUrl = `${environment.backendUrl}/api/v1/admin`;
  protected readonly httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  constructor(protected http: HttpClient) {}

  abstract initializeItem(): T;
  protected abstract buildItemUrl(...ids: any[]): string;

  getSingleItem(...ids: any[]): Observable<T> {
    const itemId = ids[ids.length - 1];

    if (itemId === 0 || itemId === "0") {
      return of(this.initializeItem());
    }

    const url = this.buildItemUrl(...ids);
    return this.http.get<T>(url);
  }
}
