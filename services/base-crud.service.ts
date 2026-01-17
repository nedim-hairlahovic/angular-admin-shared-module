import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { inject } from "@angular/core";

import { ADMIN_SHARED_CONFIG } from "../config/admin-shared-config";

export abstract class BaseCrudService<T> {
  protected readonly http = inject(HttpClient);
  private readonly config = inject(ADMIN_SHARED_CONFIG);

  protected readonly baseUrl = `${this.config.backend.url}${this.config.backend.apiBasePath}`;
  protected readonly httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

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
