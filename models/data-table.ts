import { Type } from "@angular/core";

import { CardButton } from "./data-card";
import { UrlConfig } from "./url-config";

export interface DataTableConfig<T> {
  title?: string;
  columns: DataTableColumn<T>[];
  routeConfig?: DataTableRouteConfig<T>;
  dataOptions?: DataTableDataOptions;
  idKey?: string;
  buttons?: CardButton[];
  tableClasses?: string[];
  theadClass?: string;
}

interface DataTableColumnBase {
  header: string;
  className?: string;
  width?: string;
}

export interface DataTableTextColumn<T> extends DataTableColumnBase {
  type: "text";
  value?: string;
  valueFn?: (row: T) => string;
  sortable?: boolean;
}

export interface DataTableLinkColumn<T> extends DataTableColumnBase {
  type: "link";
  value?: string;
  valueFn?: (row: T) => string;
  link: (row: T) => string;
  sortable?: boolean;
}

export interface DataTableComponentColumn<T> extends DataTableColumnBase {
  type: "component";
  component: Type<any>;
  componentInputs?: (row: T) => Record<string, any>;
}

export interface DataTableActionsColumn extends DataTableColumnBase {
  type: "actions";
  actions?: DataTableAction[];
}

export type DataTableColumn<T> =
  | DataTableTextColumn<T>
  | DataTableLinkColumn<T>
  | DataTableComponentColumn<T>
  | DataTableActionsColumn;

export interface DataTableRouteConfig<T> {
  add?: UrlConfig;
  edit?: (item: T) => UrlConfig;
}

export interface DataTableDataOptions {
  pagination?: boolean;
  search?: DataTableSearch;
  defaultSort?: DataTableColumnSort;
}

export interface DataTableColumnSort {
  field: string;
  order: "ASC" | "DESC";
}

export interface DataTableSearch {
  key: string;
  placeholder: string;
}

export interface DataTableAction {
  name: string;
  label: string;
  icon?: string;
  color?: string;
  click?: (row: any) => void;
}

export type DataTableActionClickEvent<T = any> = {
  action: DataTableAction;
  row: T;
};
