import { Directive } from "@angular/core";

import {
  DetailsViewConfigRouteConfig,
  DetailsViewData,
} from "../../models/details-view";
import { ApiResource } from "../../models/api-resource";
import { BreadcrumbItem } from "../../models/breadcrumb";
import { CardButton } from "../../models/data-card";
import { UrlConfig } from "../../models/url-config";
import { AdminAbstractEntityViewBase } from "./admin-abstract-entity-view-base";

@Directive()
export abstract class AdminAbstractDetailsViewBase<
  TEntity extends ApiResource,
> extends AdminAbstractEntityViewBase<TEntity> {
  pageTitle!: string;
  detailsViewData!: DetailsViewData;
  breadcrumbItems: BreadcrumbItem[] = [];
  actionButtons: CardButton[] = [];
  dataLoaded = false;

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Uredi",
      icon: "fa fa-pencil",
      class: "btn-primary",
      actionName: "edit",
      action: () => this.navigateToEdit(),
    },
  ];

  /** Title based on already loaded entity (use this.entity). */
  protected abstract title(): string;

  /** Details rows/cards based on already loaded entity (use this.entity). */
  protected abstract detailsData(): DetailsViewData;

  /** Routes for edit / not-found. */
  protected abstract routeConfig(): DetailsViewConfigRouteConfig<TEntity>;

  protected breadcrumbs(): BreadcrumbItem[] {
    return [];
  }

  protected buttons(): CardButton[] {
    return this.DEFAULT_BUTTONS;
  }

  protected override onEntityLoaded(entity: TEntity): void {
    // base already assigns this.entity before calling this hook
    this.pageTitle = this.title();
    this.detailsViewData = this.detailsData();
    this.breadcrumbItems = this.breadcrumbs();
    this.actionButtons = this.buttons();
    this.dataLoaded = true;
  }

  protected navigateToEdit(): void {
    const edit = this.routeConfig().edit;
    if (!edit) return;

    const { url, fragment } = edit(this.entity);
    this.router.navigate([url], { fragment });
  }

  protected buildRouteConfig(
    base: UrlConfig,
  ): DetailsViewConfigRouteConfig<TEntity> {
    return {
      edit: (entity) => ({
        url: `/${base.url}/${entity.id}/edit`,
        fragment: base.fragment,
      }),
      onNotFound: {
        url: base.url,
        fragment: base.fragment,
      },
    };
  }

  override onEntityNotFound(): void {
    const notFoundRoute = this.routeConfig()?.onNotFound;

    if (!notFoundRoute) {
      this.errorHandler.handleLoadError();
      return;
    }

    const { url, fragment } = notFoundRoute;
    this.router.navigate([url], { fragment });
  }

  protected onBtnClick(actionName: string): void {
    this.buttons()
      .find((b) => b.actionName === actionName)
      ?.action();
  }
}
