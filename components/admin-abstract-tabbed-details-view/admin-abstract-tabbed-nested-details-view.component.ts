import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";
import { BreadcrumbItem } from "../../models/breadcrumb";

@Component({
  template: "",
})
export abstract class AdminAbstractTabbedNestedDetailsViewComponent<
    T extends ApiResource,
    ID = number
  >
  extends AdminAbstractTabbedDetailsViewBase<T>
  implements OnInit
{
  parentId!: ID;
  childId!: string | null;

  constructor(
    private dataService: NestedDataService<T, any, ID>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  abstract getChildIdKey(): string;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.parentId = this.resolveParentId(params);
      this.childId = params.get(this.getChildIdKey());
      this.routeConfig = this.getRouteConfig();
      this.getItem();
    });
  }

  getItem(): void {
    this.dataService.getSingleItem(this.parentId, this.childId).subscribe({
      next: (_item: T) => {
        this.item = _item;
        this.pageTitle = this.getTitle();
        this.showTabs();
        this.breadcrumbs = this.initBreadcrumbs(_item);
      },
      error: (err) => {
        if (err.status >= 400 && err.status < 500) {
          this.onNotFoundError();
          return;
        }

        this.errorHandler.handleLoadError();
      },
    });
  }

  protected resolveParentId(params: ParamMap): ID {
    const raw = params.get(this.getParentIdKey());
    if (raw === null) return {} as ID;

    if (/^\d+$/.test(raw)) {
      return Number.parseInt(raw) as ID;
    }
    return {} as ID;
  }

  getParentIdKey(): string {
    return "id";
  }

  protected initBreadcrumbs(item: T): BreadcrumbItem[] {
    return [];
  }
}
