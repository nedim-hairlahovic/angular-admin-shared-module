import { Directive, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';
import AdminAbstractTableViewBase from './admin-abstract-table-view-base';
import { AdminConfirmDialogService } from '../../services/admin-confirm-dialog.service';

@Directive()
export abstract class AdminAbstractTableViewComponent<
  TEntity extends ApiResource,
>
  extends AdminAbstractTableViewBase<TEntity>
  implements OnInit
{
  protected readonly route = inject(ActivatedRoute);
  protected readonly confirmDialog = inject(AdminConfirmDialogService);

  constructor(private dataService: DataCrudService<TEntity, any>) {
    super();
  }

  abstract rowTitle(entity: TEntity): string;

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.queryParamMap.subscribe((params) => {
      this.searchValue = params.get('search');
    });
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
    if (!requestParams) return;

    this.tableState = requestParams;
    this.dataLoaded = false;

    this.dataService.fetchPage(requestParams).subscribe({
      next: (data) => {
        this.data = data;
        this.dataLoaded = true;
      },
      error: () => this.errorHandler.handleLoadError(),
    });
  }

  override async deleteEntity(item: TEntity): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Potvrda brisanja',
      message: this.getDeletePrompt(item),
      confirmText: 'Obriši',
      cancelText: 'Odustani',
      confirmVariant: 'danger',
    });

    if (!confirmed) return;

    this.dataService.delete(item.id).subscribe({
      next: () => {
        this.toast.success(this.deleteSuccessMessage(item));
        this.fetchData(this.tableState);
      },
      error: (err) => this.errorHandler.handleOperationError(err),
    });
  }

  protected getDeletePrompt(item: TEntity) {
    return `Da li želite obrisati ovaj podatak: ${this.rowTitle(item)}?`;
  }
}
