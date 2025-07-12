import { Directive } from "@angular/core";
import { Router } from "@angular/router";

import { DataTableAction, DataTableConfig } from "../../models/data-table";
import { CardButton } from "../../models/data-card";
import { UrlConfig } from "../../models/url-config";

@Directive()
export default abstract class AdminAbstractTableViewBase<T> {
  dataTableConfig!: DataTableConfig<T>;
  dataLoaded: boolean = false;
  errorMessage!: string;
  searchValue!: string | null;

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Dodaj",
      icon: "fa fa-plus",
      class: "btn-primary",
      actionName: "add",
      action: () => this.navigateToAddPage(),
    },
  ];

  protected abstract initDataTableConfig(): DataTableConfig<T>;
  protected abstract initializeDataTableConfigDefaults(): void;
  protected abstract fetchData(event?: any): void;
  protected abstract deleteItem(item: T): void;

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.dataTableConfig = this.initDataTableConfig();
    this.initializeDataTableConfigDefaults();
    this.fetchData();
  }

  onDelete(urlConfig: UrlConfig): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
      queryParamsHandling: "preserve",
      replaceUrl: true,
    });
  }

  onBtnClick(actionName: any): void {
    const button = this.dataTableConfig?.buttons?.find(
      (button) => button.actionName === actionName
    );
    if (button) {
      button.action();
    }
  }

  navigateToAddPage(): void {
    this.router.navigate([this.dataTableConfig.baseUrl.url + "/0/edit"]);
  }

  protected handleTableAction(event: {
    action: DataTableAction;
    row: any;
  }): void {
    if (event.action.click) {
      event.action.click(event.row);
    }
  }

  protected getDefaultTableItemActions(): DataTableAction[] {
    const idKey = this.dataTableConfig?.idKey ?? "id";
    const baseUrl = this.dataTableConfig?.baseUrl?.url ?? "";

    return [
      {
        name: "edit",
        label: "Uredi",
        icon: "fa fa-pencil",
        color: "primary",
        type: "link",
        routerLink: (row: any) => [
          baseUrl,
          this.findDeepByPath(row, idKey),
          "edit",
        ],
      },
      {
        name: "delete",
        label: "Obriši",
        icon: "fa fa-trash",
        color: "danger",
        type: "button",
        click: (row) => this.deleteItem(row),
      },
    ];
  }

  protected findDeepByPath(obj: any, path: string): any {
    return path.split(".").reduce((o, key) => (o ? o[key] : null), obj);
  }
}
