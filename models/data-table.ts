import { UrlConfig } from "./url-config";

export interface DataTableConfig {
  title: string;
  data: any[] | any;
  columns: DataTableColumn[];
  baseUrl: UrlConfig;
  pagination?: DataTablePaginationType;
  defaultSort?: DataTableColumnSort;
  search?: DataTableSearch;
  idKey?: string;
  addButton?: DataTableButton;
  editButton?: DataTableButton;
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

export interface DataTableButton {
  enabled: boolean;
  url: string;
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
