import { Component, inject, Input, OnInit } from "@angular/core";

import { NestedDataService } from "../../services/nested-data.service";
import { ApiResource } from "../../models/api-resource";
import AdminAbstractTableViewBase from "./admin-abstract-table-view-base";
import { AdminConfirmDialogService } from "../../services/admin-confirm-dialog.service";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedTableViewComponent<
  T extends ApiResource,
  ID = number,
>
  extends AdminAbstractTableViewBase<T>
  implements OnInit
{
  @Input() parentId!: ID;

  abstract getDeletePrompt(): string;

  protected readonly confirmDialog = inject(AdminConfirmDialogService);

  constructor(private dataService: NestedDataService<T, any, ID>) {
    super();
  }

  override initializeDataTableConfigDefaults(): void {
    if (!this.config.buttons) {
      this.config.buttons = this.DEFAULT_BUTTONS;
    }

    const actionsColumn = this.config.columns.find(
      (c) => c.value === "actions",
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

  override async deleteItem(item: T): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: "Potvrda brisanja",
      message: this.getDeletePrompt(),
      confirmText: "Obriši",
      cancelText: "Odustani",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    this.dataService.deleteItem(this.parentId, item.id).subscribe({
      next: () => {
        this.toast.success(this.getDeleteSuccessMessage(item));
        this.fetchData(this.tableState);
      },
      error: (err) => this.errorHandler.handleOperationError(err),
    });
  }
}
