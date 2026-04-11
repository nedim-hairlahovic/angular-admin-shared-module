import { Type } from "@angular/core";
import { FormGroup, ValidatorFn } from "@angular/forms";

import { ApiResource } from "./api-resource";
import { DataCrudService } from "../services/data.service";
import { SearchableSelectItem } from "./searchable-select-item";
import { UrlConfig } from "./url-config";

export interface DataFormConfig<TEntity extends ApiResource, TForm> {
  title?: string;
  elements: DataFormElement<TForm>[];
  data?: TForm;
  routeConfig: DataFormRouteConfig<TEntity>;
  isEditMode?: boolean;
  requestFieldMap?: FormToRequestFieldMap<TForm>;
}

export interface DataFormElement<TForm> {
  id: Extract<keyof TForm, string>;
  name: Extract<keyof TForm, string>;
  label: string;
  description?: string;
  type: DataFormElementType;
  mode: DataFormControlMode;
  validators?: ValidatorConfig[];
  values?: DataFormSelectOption[];
  dataService?: DataCrudService<any, any>;
  defaultValue?: any;
  disabled?: boolean;
  itemComponent?: Type<any>;
  itemComponentInputsFn?: (
    item: SearchableSelectItem,
  ) => Record<string, unknown>;
  onChange?: (value: any, form: FormGroup) => void;
}

export enum DataFormControlMode {
  Control = "Control",
  Array = "Array",
  Group = "Group",
}

// Maps form field names to request (backend) field names
export type FormToRequestFieldMap<TForm> = Partial<
  Record<Extract<keyof TForm, string>, string>
>;

export interface DataFormSelectOption {
  value: string;
  label: string;
}

export enum DataFormElementType {
  Text,
  Date,
  Number,
  Select,
  SearchableSelect,
  TextArea,
  Time,
  Checkbox,
}

export interface DataFormRouteConfig<TEntity extends ApiResource> {
  onSave: (item: TEntity) => UrlConfig;
  onNotFound: UrlConfig;
}

export interface ValidatorConfig {
  key: string;
  validator: ValidatorFn;
  message: string;
}
