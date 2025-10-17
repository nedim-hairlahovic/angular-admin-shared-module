import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";
import { BreadcrumbItem } from "../../models/breadcrumb";
import { DetailsViewConfigRouteConfig } from "../../models/details-view";
import { UrlConfig } from "../../models/url-config";

@Component({
  template: "",
})
export abstract class AdminAbstractTabbedDetailsViewComponent<
    T extends ApiResource
  >
  extends AdminAbstractTabbedDetailsViewBase<T>
  implements OnInit
{
  constructor(
    private dataService: DataCrudService<T, any>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.routeConfig = this.getRouteConfig();
        this.getItem(id);
      }
    });
  }

  getItem(id: any): void {
    this.dataService.getSingleItem(id).subscribe({
      next: (_item: T) => {
        this.item = _item;
        this.pageTitle = this.getTitle();
        this.showTabs();
        this.breadcrumbs = this.initBreadcrumbs();
      },
      error: (err) => {
        if (err.status >= 400 && err.status < 500) {
          this.onNotFoundError();
          return;
        }

        console.log(err.error.message);
      },
    });
  }

  protected initBreadcrumbs(): BreadcrumbItem[] {
    return [];
  }

  protected initRouteConfig(
    baseConfig: UrlConfig
  ): DetailsViewConfigRouteConfig<T> {
    return {
      edit: (item: T) => ({
        url: `/${baseConfig.url}/${item.id}/edit`,
        fragment: baseConfig.fragment,
      }),
      onNotFound: {
        url: baseConfig.url,
        fragment: baseConfig.fragment,
      },
    };
  }
}
