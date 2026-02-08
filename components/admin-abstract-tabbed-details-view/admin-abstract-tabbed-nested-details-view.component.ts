import { Directive } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";

@Directive()
export abstract class AdminAbstractTabbedNestedDetailsViewComponent<
  TEntity extends ApiResource,
  TParentId extends any = number,
> extends AdminAbstractTabbedDetailsViewBase<TEntity> {
  parentId!: any;
  childId!: string | null;

  constructor(private dataService: NestedDataService<TEntity, any, TParentId>) {
    super();
  }

  /** Route param key for this entity id. */
  protected abstract override entityIdParam(): string;

  /** Route param key for the parent entity id. */
  protected parentIdParam(): string {
    return "id";
  }

  protected override extractIds(params: ParamMap): void {
    this.parentId = this.resolveParentId(params);
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }

  protected resolveParentId(params: ParamMap): TParentId {
    return this.readIdParam(params, this.parentIdParam());
  }

  protected override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.parentId, this.entityId);
  }

  protected override onEntityLoaded(entity: TEntity): void {
    super.onEntityLoaded(entity);

    this.config = {
      routeConfig: this.routeConfig(),
      tabs: this.tabs(),
    };

    this.pageTitle = this.title();
    this.showTabs();
  }
}
