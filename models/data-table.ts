import { CardButton } from "./data-card";
import { Page } from "./page";
import { UrlConfig } from "./url-config";

export interface DataTableConfig<T> {
  title: string;
  data: T[] | Page<T>;
  columns: DataTableColumn[];
  baseUrl: UrlConfig;
  pagination?: DataTablePaginationType;
  defaultSort?: DataTableColumnSort;
  search?: DataTableSearch;
  idKey?: string;
  buttons?: CardButton[];
}

export interface DataTableColumn {
  header: string;
  value?: string;
  values?: string[];
  templateString?: string;
  className?: string;
  url?: DataTableColumnUrl;
  sortable?: boolean;
}

export interface DataTableColumnUrl {
  path: string;
  value?: string;
}

export enum DataTablePaginationType {
  SPRING,
}

export interface DataTableColumnSort {
  field: string;
  order: "ASC" | "DESC";
}

export interface DataTableSearch {
  key: string;
  placeholder: string;
}
