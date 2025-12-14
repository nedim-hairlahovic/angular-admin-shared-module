import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NestedDataService } from "../../services/nested-data.service";
import { ApiResource } from "../../models/api-resource";
import AdminAbstractTableViewBase from "./admin-abstract-table-view-base";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedTableViewComponent<
    T extends ApiResource,
    ID = number
  >
  extends AdminAbstractTableViewBase<T>
  implements OnInit
{
  @Input() parentId!: ID;

  abstract getDeletePrompt(): string;

  constructor(
    private dataService: NestedDataService<T, any, ID>,
    router: Router
  ) {
    super(router);
  }

  override initializeDataTableConfigDefaults(): void {
    if (!this.config.buttons) {
      this.config.buttons = this.DEFAULT_BUTTONS;
    }

    const actionsColumn = this.config.columns.find(
      (c) => c.value === "actions"
    );
    if (actionsColumn && !actionsColumn.actions) {
      actionsColumn.actions = this.DEFAULT_ACTIONS;
    }
  }

  override fetchData(event?: any): void {
    this.dataLoaded = false;
    this.dataService.getItems(this.parentId).subscribe({
      next: (data) => {
        this.data = data;
        this.dataLoaded = true;
      },
      error: (err) => this.errorHandler.handleLoadError(),
    });
  }

  override deleteItem(item: T): void {
    if (confirm(this.getDeletePrompt())) {
      this.dataService.deleteItem(this.parentId, item.id).subscribe({
        next: () => {
          this.toast.success(this.getDeleteSuccessMessage(item));
          this.fetchData(this.tableState);
        },
        error: (err) => this.errorHandler.handleOperationError(err),
      });
    }
  }
}
