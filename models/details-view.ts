import { UrlConfig } from "./url-config";

export interface DetailsViewData {
  info?: DetailsViewInfo;
  fields: DetailsViewField[];
}

export interface DetailsViewInfo {
  id?: number | string;
  lastUpdated?: string;
  publicUrl?: string;
}

export interface DetailsViewField {
  label: string;
  value?: string;
  links?: DetailsViewLink[];
  description?: string;
  fullWidth?: boolean;
}

export interface DetailsViewLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface DetailsViewConfigRouteConfig<T> {
  edit?: (item: T) => UrlConfig;
  onNotFound: UrlConfig;
}
