import { Component, Input, OnInit } from "@angular/core";

import { AdminTabConfig } from "../../models/tabbed-view";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";
import {
  DetailsViewConfigRouteConfig,
  DetailsViewData,
} from "../../models/details-view";
import { ApiResource } from "../../models/api-resource";

@Component({
  selector: "admin-tabbed-details-view-template",
  templateUrl: "./admin-tabbed-details-view-template.component.html",
  styleUrl: "../../admin-shared.css",
  standalone: false,
})
export class AdminTabbedDetailsViewTemplateComponent<T extends ApiResource>
  extends AdminAbstractTabbedDetailsViewBase<T>
  implements OnInit
{
  @Input() override tabs!: AdminTabConfig[];
  @Input() override pageTitle!: string;

  ngOnInit(): void {
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
