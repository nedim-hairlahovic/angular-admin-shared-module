import { PipeTransform } from "@angular/core";

import { CardButton } from "./data-card";
import { UrlConfig } from "./url-config";

export interface DataTableConfig<T> {
  title?: string;
  columns: DataTableColumn<T>[];
  routeConfig?: DataTableRouteConfig<T>;
  dataOptions?: DataTableDataOptions;
  idKey?: string;
  buttons?: CardButton[];
}

export interface DataTableColumn<T> {
  header: string;
  value?: string; // property name in the row
  valueFn?: (row: T) => string; // custom function for derived value
  className?: string;
  width?: string; // in percentages
  link?: (row: T) => string;
  sortable?: boolean;
  pipe?: {
    instance: PipeTransform;
    args?: any[];
  };
  actions?: DataTableAction[];
  badge?: {
    [key: string]: string; // mapping value → bootstrap class (success, danger, warning, etc.)
  };
}

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
