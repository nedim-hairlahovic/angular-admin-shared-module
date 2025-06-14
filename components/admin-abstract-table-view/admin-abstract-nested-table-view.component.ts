import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NestedDataService } from "../../services/nested-data.service";
import { ApiResource } from "../../models/api-resource";
import { UrlConfig } from "../../models/url-config";
import AdminAbstractTableViewBase from "./admin-abstract-table-view-base";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedTableViewComponent<
    T extends ApiResource
  >
  extends AdminAbstractTableViewBase<T>
  implements OnInit
{
  @Input() parentId!: number;

  abstract getDeletePrompt(): string;
  abstract getBackUrl(): UrlConfig;

  constructor(private dataService: NestedDataService<T>, router: Router) {
    super(router);
  }

  override initializeDataTableConfigDefaults(): void {
    if (!this.dataTableConfig.buttons) {
      this.dataTableConfig.buttons = this.DEFAULT_BUTTONS;
    }
  }

  override fetchData(event?: any): void {
    this.dataLoaded = false;
    this.dataService.getItems(this.parentId).subscribe({
      next: (data) => {
        this.dataTableConfig.data = data;
        this.dataLoaded = true;
      },
      error: (err) => console.log(err),
    });
  }

  override deleteItem(item: T): void {
    if (confirm(this.getDeletePrompt())) {
      this.dataService.deleteItem(this.parentId, item.id).subscribe({
        next: () => this.onDelete(this.getBackUrl()),
        error: (err) => (this.errorMessage = err.error.message),
      });
    }
  }
}
