import { Type } from "@angular/core";
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

interface DetailsViewFieldBase {
  label: string;
  fullWidth?: boolean;
  description?: string;
}

export interface DetailsViewTextField extends DetailsViewFieldBase {
  type: "text";
  value?: string | number | null;
}

export interface DetailsViewLinkField extends DetailsViewFieldBase {
  type: "link";
  links: DetailsViewLink[];
}

export interface DetailsViewComponentField extends DetailsViewFieldBase {
  type: "component";
  component: Type<any>;
  componentInputs?: Record<string, any>;
}

export type DetailsViewField =
  | DetailsViewTextField
  | DetailsViewLinkField
  | DetailsViewComponentField;

export interface DetailsViewLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

export interface DetailsViewConfigRouteConfig<T> {
  edit?: (item: T) => UrlConfig;
  onNotFound: UrlConfig;
}
