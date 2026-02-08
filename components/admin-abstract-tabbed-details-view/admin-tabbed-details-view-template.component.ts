import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import {
  AdminTabConfig,
  TabbedDetailsViewConfig,
} from "../../models/tabbed-view";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";
import {
  DetailsViewConfigRouteConfig,
  DetailsViewData,
} from "../../models/details-view";
import { ApiResource } from "../../models/api-resource";
import { AdminBreadcrumbsComponent } from "../admin-breadcrumbs/admin-breadcrumbs.component";

@Component({
  selector: "admin-tabbed-details-view-template",
  templateUrl: "./admin-tabbed-details-view-template.component.html",
  standalone: true,
  imports: [AdminBreadcrumbsComponent],
})
export class AdminTabbedDetailsViewTemplateComponent<
  TEntity extends ApiResource,
>
  extends AdminAbstractTabbedDetailsViewBase<TEntity>
  implements OnChanges
{
  @Input() declare config: TabbedDetailsViewConfig<TEntity>;
  @Input() declare pageTitle: string;

  override ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.showTabs();
  }

  override title(): string {
    return "";
  }
  override tabs(): AdminTabConfig[] {
    return [];
  }
  override navigateToEdit(): void {}
  override detailsData(): DetailsViewData {
    return {} as DetailsViewData;
  }
  override routeConfig(): DetailsViewConfigRouteConfig<TEntity> {
    return {} as DetailsViewConfigRouteConfig<TEntity>;
  }

  protected override entityIdParam(): string {
    throw new Error("Method not implemented.");
  }
  protected override extractIds(params: ParamMap): void {
    throw new Error("Method not implemented.");
  }
  protected override fetch$(): Observable<TEntity> {
    throw new Error("Method not implemented.");
  }
}
