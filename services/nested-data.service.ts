import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { BaseCrudService } from "./base-crud.service";

@Injectable({
  providedIn: "root",
})
export abstract class NestedDataService<
  TEntity,
  TRequest,
  TParentId extends string | number | any = number,
  TChildId extends string | number = number,
> extends BaseCrudService<TEntity> {
  abstract getCollectionUrl(parentId: TParentId): string;

  protected buildEntityUrl(parentId: TParentId, childId: TChildId): string {
    return `${this.getCollectionUrl(parentId)}/${childId}`;
  }

  fetchAll(parentId: TParentId, params?: HttpParams): Observable<TEntity[]> {
    return this.http.get<TEntity[]>(this.getCollectionUrl(parentId), {
      params,
    });
  }

  create(parentId: TParentId, request: TRequest): Observable<TEntity> {
    return this.http.post<TEntity>(this.getCollectionUrl(parentId), request, {
      headers: this.httpHeaders,
    });
  }

  update(
    parentId: TParentId,
    childId: TChildId,
    request: TRequest,
  ): Observable<TEntity> {
    return this.http.put<TEntity>(
      this.buildEntityUrl(parentId, childId),
      request,
      { headers: this.httpHeaders },
    );
  }

  delete(parentId: TParentId, childId: TChildId): Observable<void> {
    return this.http.delete<void>(this.buildEntityUrl(parentId, childId), {
      headers: this.httpHeaders,
    });
  }
}
