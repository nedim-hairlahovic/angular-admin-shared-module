import { Directive } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import { AdminAbstractDetailsViewBase } from "./admin-abstract-details-view.base";

@Directive()
export abstract class AdminAbstractDetailsViewComponent<
  TEntity extends ApiResource,
> extends AdminAbstractDetailsViewBase<TEntity> {
  constructor(private dataService: DataCrudService<TEntity, any>) {
    super();
  }

  protected override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.entityId);
  }

  override entityIdParam(): string {
    return "id";
  }

  protected override extractIds(params: ParamMap): void {
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }
}
