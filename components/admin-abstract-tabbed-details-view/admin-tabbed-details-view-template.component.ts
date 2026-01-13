import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

import { AdminTabConfig } from "../../models/tabbed-view";
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
  styleUrl: "../../admin-shared.css",
  standalone: true,
  imports: [AdminBreadcrumbsComponent],
})
export class AdminTabbedDetailsViewTemplateComponent<T extends ApiResource>
  extends AdminAbstractTabbedDetailsViewBase<T>
  implements OnChanges
{
  @Input() declare tabs: AdminTabConfig[];
  @Input() declare pageTitle: string;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.showTabs();
  }

  override getTitle(): string {
    return "";
  }
  override initTabs(): void {}
  override navigateToEdit(): void {}
  override getDetailsData(): DetailsViewData {
    return {} as DetailsViewData;
  }
  override getRouteConfig(): DetailsViewConfigRouteConfig<T> {
    return {} as DetailsViewConfigRouteConfig<T>;
  }
}
