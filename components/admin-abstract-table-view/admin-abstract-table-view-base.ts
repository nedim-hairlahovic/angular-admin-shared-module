import { Directive } from "@angular/core";
import { Router } from "@angular/router";

import { DataTableConfig } from "../../models/data-table";
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
}
