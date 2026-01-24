import { Directive } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import { AdminAbstractDetailsViewBase } from "./admin-abstract-details-view.base";

@Directive()
export abstract class AdminAbstractNestedDetailsViewComponent<
  TEntity extends ApiResource,
> extends AdminAbstractDetailsViewBase<TEntity> {
  parentId!: string | number;

  constructor(protected readonly dataService: NestedDataService<TEntity, any>) {
    super();
  }

  /** Route param key for this entity id. */
  protected abstract override entityIdParam(): string;

  /** Route param key for the parent entity id. */
  protected parentIdParam(): string {
    return "id";
  }

  protected override extractIds(params: ParamMap): void {
    this.parentId = this.readIdParam(params, this.parentIdParam());
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }

  protected override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.parentId, this.entityId);
  }
}
