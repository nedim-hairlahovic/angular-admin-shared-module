import { Directive, inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  DataTableAction,
  DataTableConfig,
  DataTableRouteConfig,
} from '../../models/data-table';
import { CardButton } from '../../models/data-card';
import { BreadcrumbItem } from '../../models/breadcrumb';
import { AdminToastService } from '../../services/admin-toast.service';
import { AdminErrorHandlerService } from '../../services/admin-error-handler.service';
import { PagedData } from '../../config/backend/backend-types';
import { getObjectValueByPath } from '../../utils/object.utils';

@Directive()
export default abstract class AdminAbstractTableViewBase<TEntity> {
  protected config!: DataTableConfig<TEntity>;
  protected data!: TEntity[] | PagedData<TEntity>;
  dataLoaded: boolean = false;
  searchValue!: string | null;
  tableState!: any;
  protected breadcrumbItems: BreadcrumbItem[] = [];

  protected readonly router = inject(Router);
  protected readonly toast = inject(AdminToastService);
  protected readonly errorHandler = inject(AdminErrorHandlerService);

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: 'Dodaj',
      icon: 'fa-plus',
      class: 'btn-primary',
      actionName: 'add',
      action: () => this.navigateToAddPage(),
    },
  ];

  protected readonly DEFAULT_ACTIONS: DataTableAction[] = [
    {
      name: 'edit',
      label: 'Uredi',
      icon: 'fa fa-sm fa-pencil',
      color: 'primary',
      click: (row) => this.navigateToEditPage(row),
    },
    {
      name: 'delete',
      label: 'Obriši',
      icon: 'fa fa-sm fa-trash-o',
      color: 'danger',
      click: (row) => this.deleteEntity(row),
    },
  ];

  protected abstract tableConfig(): DataTableConfig<TEntity>;
  protected abstract applyTableConfigDefaults(): void;
  protected abstract fetchData(requestParams?: any): void;
  protected abstract deleteEntity(entity: TEntity): void;
  protected abstract deleteSuccessMessage(entity: TEntity): string;

  ngOnInit(): void {
    this.config = this.tableConfig();
    this.breadcrumbItems = this.breadcrumbs();
    this.applyTableConfigDefaults();
    this.fetchData();
  }

  buildRouteConfig(basePath: string): DataTableRouteConfig<TEntity> {
    return {
      add: { url: `/${basePath}/0/edit` },
      edit: (entity: TEntity) => {
        let idKey = this.config.idKey ?? 'id';
        const id = getObjectValueByPath(entity, idKey);
        return { url: `/${basePath}/${id}/edit` };
      },
    };
  }

  navigateToAddPage(): void {
    const route = this.config.routeConfig?.add;
    if (!route) return;

    const { url, fragment, queryParams } = route;
    this.router.navigate([url], { fragment, queryParams });
  }

  navigateToEditPage(entity: TEntity): void {
    const edit = this.config.routeConfig?.edit;
    if (!edit) return;

    const { url, fragment, queryParams } = edit(entity);
    this.router.navigate([url], { fragment, queryParams });
  }

  onBtnClick(actionName: any): void {
    const button = this.config.buttons?.find(
      (button) => button.actionName === actionName,
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

  protected breadcrumbs(): BreadcrumbItem[] {
    return [];
  }
}
