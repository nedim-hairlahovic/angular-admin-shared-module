import { Directive, inject } from "@angular/core";
import { Router } from "@angular/router";

import {
  DataTableAction,
  DataTableConfig,
  DataTableRouteConfig,
} from "../../models/data-table";
import { CardButton } from "../../models/data-card";
import { BreadcrumbItem } from "../../models/breadcrumb";
import { Page } from "../../models/page";
import { AdminToastService } from "../../services/admin-toast.service";
import { AdminErrorHandlerService } from "../../services/admin-error-handler.service";

@Directive()
export default abstract class AdminAbstractTableViewBase<T> {
  protected config!: DataTableConfig<T>;
  protected data!: T[] | Page<T>;
  dataLoaded: boolean = false;
  searchValue!: string | null;
  tableState!: any;
  protected breadcrumbs!: BreadcrumbItem[];

  protected readonly toast = inject(AdminToastService);
  protected readonly errorHandler = inject(AdminErrorHandlerService);

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Dodaj",
      icon: "fa-plus",
      class: "btn-primary",
      actionName: "add",
      action: () => this.navigateToAddPage(),
    },
  ];

  protected readonly DEFAULT_ACTIONS: DataTableAction[] = [
    {
      name: "edit",
      label: "Uredi",
      icon: "fa fa-sm fa-pencil",
      color: "primary",
      click: (row) => this.navigateToEditPage(row),
    },
    {
      name: "delete",
      label: "Obriši",
      icon: "fa fa-sm fa-trash-o",
      color: "danger",
      click: (row) => this.deleteItem(row),
    },
  ];

  protected abstract initDataTableConfig(): DataTableConfig<T>;
  protected abstract initializeDataTableConfigDefaults(): void;
  protected abstract fetchData(event?: any): void;
  protected abstract deleteItem(item: T): void;
  protected abstract getDeleteSuccessMessage(item: T): string;

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.config = this.initDataTableConfig();
    this.breadcrumbs = this.initBreadcrumbs();
    this.initializeDataTableConfigDefaults();
    this.fetchData();
  }

  initRouteConfig(basePath: string): DataTableRouteConfig<T> {
    return {
      add: { url: `/${basePath}/0/edit` },
      edit: (item: T) => {
        let idKey = this.config.idKey ?? "id";
        const id = this.findDeepByPath(item, idKey);
        return { url: `/${basePath}/${id}/edit` };
      },
    };
  }

  navigateToAddPage(): void {
    if (this.config.routeConfig?.add) {
      const urlConfig = this.config.routeConfig.add;
      this.router.navigate([urlConfig.url], {
        fragment: urlConfig.fragment,
        queryParams: urlConfig.queryParams,
      });
    }
  }

  navigateToEditPage(item: T): void {
    if (this.config.routeConfig?.edit) {
      const urlConfig = this.config.routeConfig.edit(item);
      this.router.navigate([urlConfig.url], {
        fragment: urlConfig.fragment,
        queryParams: urlConfig.queryParams,
      });
    }
  }

  onBtnClick(actionName: any): void {
    const button = this.config.buttons?.find(
      (button) => button.actionName === actionName
    );
    if (button) {
      button.action();
    }
  }

  protected handleTableAction(event: {
    action: DataTableAction;
    row: any;
  }): void {
    if (event.action.click) {
      event.action.click(event.row);
    }
  }

  protected findDeepByPath(obj: any, path: string): any {
    return path.split(".").reduce((o, key) => (o ? o[key] : null), obj);
  }

  protected initBreadcrumbs(): BreadcrumbItem[] {
    return [];
  }
}
