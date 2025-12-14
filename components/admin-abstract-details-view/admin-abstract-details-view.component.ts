import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
  DetailsViewConfigRouteConfig,
  DetailsViewData,
} from "../../models/details-view";
import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import { CardButton } from "../../models/data-card";
import { BreadcrumbItem } from "../../models/breadcrumb";
import { UrlConfig } from "../../models/url-config";
import { AdminErrorHandlerService } from "../../services/admin-error-handler.service";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractDetailsViewComponent<T extends ApiResource>
  implements OnInit
{
  item!: T;
  protected pageTitle!: string;
  protected routeConfig!: DetailsViewConfigRouteConfig<T>;
  protected breadcrumbs!: BreadcrumbItem[];

  abstract getTitle(): string;
  abstract getDetailsData(): DetailsViewData;
  abstract getRouteConfig(): DetailsViewConfigRouteConfig<T>;

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Uredi",
      icon: "fa fa-pencil",
      class: "btn-primary",
      actionName: "edit",
      action: () => this.navigateToEdit(),
    },
  ];

  protected readonly errorHandler = inject(AdminErrorHandlerService);

  constructor(
    private dataService: DataCrudService<T, any>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
        this.breadcrumbs = this.initBreadcrumbs();
      },
      error: (err) => {
        if (err.status === 404) {
          this.onNotFoundError();
          return;
        }

        this.errorHandler.handleLoadError();
      },
    });
  }

  buildRouteConfig(baseConfig: UrlConfig): DetailsViewConfigRouteConfig<T> {
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

  navigateToEdit(): void {
    if (this.routeConfig?.edit) {
      const urlConfig = this.routeConfig.edit(this.item);
      this.router.navigate([urlConfig.url], {
        fragment: urlConfig.fragment,
      });
    }
  }

  protected onNotFoundError(): void {
    const urlConfig = this.routeConfig?.onNotFound;
    if (!urlConfig) {
      return;
    }
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
    });
  }

  onBtnClick(actionName: any): void {
    const button = this.findButtonByActionName(actionName);
    if (button) {
      button.action();
    }
  }

  protected getButtons(): CardButton[] {
    return this.DEFAULT_BUTTONS;
  }

  findButtonByActionName(actionName: string): CardButton | undefined {
    return this.getButtons().find((button) => button.actionName === actionName);
  }

  protected initBreadcrumbs(): BreadcrumbItem[] {
    return [];
  }
}
