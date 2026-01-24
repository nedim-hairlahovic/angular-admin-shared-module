import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { inject } from "@angular/core";

import { ADMIN_SHARED_CONFIG } from "../config/admin-shared-config";

export abstract class BaseCrudService<TEntity> {
  protected readonly http = inject(HttpClient);
  private readonly config = inject(ADMIN_SHARED_CONFIG);

  protected readonly baseUrl = `${this.config.backend.url}${this.config.backend.apiBasePath}`;
  protected readonly httpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  });

  abstract initEmpty(): TEntity;

  protected abstract buildEntityUrl(...ids: (string | number | any)[]): string;

  fetch(...ids: (string | number)[]): Observable<TEntity> {
    const id = ids[ids.length - 1];

    if (id === 0 || id === "0") {
      return of(this.initEmpty());
    }

    return this.http.get<TEntity>(this.buildEntityUrl(...ids));
  }
}
