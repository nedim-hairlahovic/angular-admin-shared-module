import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractTableViewBase from "./admin-abstract-table-view-base";
import { AdminConfirmDialogService } from "../../services/admin-confirm-dialog.service";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractTableViewComponent<T extends ApiResource>
  extends AdminAbstractTableViewBase<T>
  implements OnInit
{
  abstract getItemTitle(item: T): string;

  protected readonly route = inject(ActivatedRoute);
  protected readonly confirmDialog = inject(AdminConfirmDialogService);

  constructor(private dataService: DataCrudService<T, any>) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.queryParamMap.subscribe((params) => {
      this.searchValue = params.get("search"); // or make this dynamic later
    });
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

  override fetchData(requestParams?: any): void {
    if (!requestParams) return;

    this.tableState = requestParams;
    this.dataLoaded = false;

    this.dataService.getPagedItems(requestParams).subscribe({
      next: (data) => {
        this.data = data;
        this.dataLoaded = true;
      },
      error: () => this.errorHandler.handleLoadError(),
    });
  }

  override async deleteItem(item: T): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: "Potvrda brisanja",
      message: this.getDeletePrompt(item),
      confirmText: "Obriši",
      cancelText: "Odustani",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    this.dataService.deleteItem(item.id).subscribe({
      next: () => {
        this.toast.success(this.getDeleteSuccessMessage(item));
        this.fetchData(this.tableState);
      },
      error: (err) => this.errorHandler.handleOperationError(err),
    });
  }

  protected getDeletePrompt(item: T) {
    return `Da li želite obrisati ovaj podatak: ${this.getItemTitle(item)}?`;
  }
}
