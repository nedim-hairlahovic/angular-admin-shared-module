import { Directive, OnInit } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";
import { DetailsViewConfigRouteConfig } from "../../models/details-view";
import { UrlConfig } from "../../models/url-config";

@Directive()
export abstract class AdminAbstractTabbedDetailsViewComponent<
  TEntity extends ApiResource,
>
  extends AdminAbstractTabbedDetailsViewBase<TEntity>
  implements OnInit
{
  constructor(private dataService: DataCrudService<TEntity, any>) {
    super();
  }

  override entityIdParam(): string {
    return "id";
  }

  override extractIds(params: ParamMap): void {
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }

  override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.entityId);
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

  protected buildDefaultRouteConfig(
    baseConfig: UrlConfig,
  ): DetailsViewConfigRouteConfig<TEntity> {
    return {
      edit: (entity: TEntity) => ({
        url: `/${baseConfig.url}/${entity.id}/edit`,
        fragment: baseConfig.fragment,
      }),
      onNotFound: {
        url: baseConfig.url,
        fragment: baseConfig.fragment,
      },
    };
  }
}
