import { Type } from "@angular/core";
import { Observable } from "rxjs";

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

export interface DetailsViewImageUploadConfig {
  /** Card header label. */
  label: string;
  /** Current image URL shown as preview in edit mode. */
  currentUrl?: string | null;
  /** Accepted MIME types passed to the file input. Defaults to 'image/*'. */
  accept?: string;
  /** Max file size in bytes. No limit when omitted. */
  maxSizeBytes?: number;
  /** Called with the selected File; must return an Observable of the saved entity. */
  uploadFn: (file: File) => Observable<any>;
  /** Optional. Called when the user removes the image; must return an Observable. */
  deleteFn?: () => Observable<any>;
}
