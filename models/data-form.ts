import { ValidatorFn } from "@angular/forms";

import { ApiResource } from "./api-resource";
import { DataCrudService } from "../services/data.service";
import { UrlConfig } from "./url-config";

export interface DataFormConfig<T extends ApiResource, R> {
  title: string;
  data?: any;
  elements: DataFormElement<T, R>[];
  validationMessages: { [key: string]: { [key: string]: string } };
  errorMessage?: string;
  baseUrl: UrlConfig;
}

export interface DataFormElement<T extends ApiResource, R> {
  type: DataFormElementType;
  mode: DataFormControlMode;
  id: string;
  name: string;
  label: string;
  validators?: ValidatorFn[];
  values?: DataFormSelectOption[];
  dataService?: DataCrudService<T, R>;
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
