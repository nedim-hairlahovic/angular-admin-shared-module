import { Directive, inject, Input, OnInit } from '@angular/core';

import { NestedDataService } from '../../services/nested-data.service';
import { ApiResource } from '../../models/api-resource';
import AdminAbstractTableViewBase from './admin-abstract-table-view-base';
import { AdminConfirmDialogService } from '../../services/admin-confirm-dialog.service';

@Directive()
export abstract class AdminAbstractNestedTableViewComponent<
  TEntity extends ApiResource,
  TParentId extends string | number = number,
>
  extends AdminAbstractTableViewBase<TEntity>
  implements OnInit
{
  @Input() parentId!: TParentId;

  abstract getDeletePrompt(): string;

  protected readonly confirmDialog = inject(AdminConfirmDialogService);

  constructor(private dataService: NestedDataService<TEntity, any, TParentId>) {
    super();
  }

  override applyTableConfigDefaults(): void {
    if (!this.config.buttons) {
      this.config.buttons = this.DEFAULT_BUTTONS;
    }

    const actionsColumn = this.config.columns.find(
      (c) => c.value === 'actions',
    );
    if (actionsColumn && !actionsColumn.actions) {
      actionsColumn.actions = this.DEFAULT_ACTIONS;
    }
  }

  override fetchData(requestParams?: any): void {
    if (this.config.dataOptions?.pagination && !requestParams) return;

    this.tableState = requestParams;
    this.dataLoaded = false;

    this.dataService.fetchAll(this.parentId, requestParams).subscribe({
      next: (data) => {
        this.data = data;
        this.dataLoaded = true;
      },
      error: () => this.errorHandler.handleLoadError(),
    });
  }

  override async deleteEntity(entity: TEntity): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Potvrda brisanja',
      message: this.getDeletePrompt(),
      confirmText: 'Obriši',
      cancelText: 'Odustani',
      confirmVariant: 'danger',
    });

    if (!confirmed) return;

    this.dataService.delete(this.parentId, entity.id).subscribe({
      next: () => {
        this.toast.success(this.deleteSuccessMessage(entity));
        this.fetchData(this.tableState);
      },
      error: (err) => this.errorHandler.handleOperationError(err),
    });
  }
}
