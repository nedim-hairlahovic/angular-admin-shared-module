import { ValidatorFn } from "@angular/forms";

import { ApiResource } from "./api-resource";
import { DataCrudService } from "../services/data.service";
import { UrlConfig } from "./url-config";

export interface DataFormConfig<T extends ApiResource, R> {
  title: string;
  data?: any;
  elements: DataFormElement<T, R>[];
  routeConfig?: DataFormRouteConfig<T>;
}

export interface DataFormElement<T extends ApiResource, R> {
  id: string;
  name: string;
  label: string;
  type: DataFormElementType;
  mode: DataFormControlMode;
  validators?: ValidatorConfig[];
  values?: DataFormSelectOption[];
  dataService?: DataCrudService<any, any>;
  defaultValue?: any;
  disabled?: boolean;
}

export enum DataFormControlMode {
  Control = "Control",
  Array = "Array",
  Group = "Group",
}

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

export interface DataFormRouteConfig<T> {
  onSave: (item?: T) => UrlConfig;
  onNotFound: UrlConfig;
}

export interface ValidatorConfig {
  key: string;
  validator: ValidatorFn;
  message: string;
}
