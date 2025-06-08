import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { DataTablePaginationType } from "../../models/data-table";
import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractTableViewBase from "./admin-abstract-table-view-base";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractTableViewComponent<T extends ApiResource>
  extends AdminAbstractTableViewBase<T>
  implements OnInit
{
  abstract getItemTitle(item: T): string;

  constructor(
    private dataService: DataCrudService<T>,
    router: Router,
    private route: ActivatedRoute
  ) {
    super(router);
  }

  override initializeDataTableConfigDefaults(): void {
    if (!this.dataTableConfig.pagination) {
      this.dataTableConfig.pagination = DataTablePaginationType.SPRING;
    }

    if (!this.dataTableConfig.buttons) {
      this.dataTableConfig.buttons = this.DEFAULT_BUTTONS;
    }
  }

  override fetchData(requestParams?: any): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchValue = params.get("search");

      if (requestParams == null) {
        return;
      }

      this.dataLoaded = false;
      this.dataService.getPagedItems(requestParams).subscribe({
        next: (data) => {
          this.dataTableConfig.data = data;
          this.dataLoaded = true;
        },
        error: (err) => console.log(err),
      });
    });
  }

  override deleteItem(item: T): void {
    if (
      confirm(`Da li želite obrisati ovaj podatak: ${this.getItemTitle(item)}?`)
    ) {
      this.dataService.deleteItem(item.id).subscribe({
        next: () => this.onDelete(this.dataTableConfig.baseUrl),
        error: (err) => (this.errorMessage = err.error.message),
      });
    }
  }
}
