import { ValidatorFn } from "@angular/forms";

import { ApiResource } from "./api-resource";
import { DataCrudService } from "../services/data.service";

export interface DataFormConfig<T extends ApiResource> {
  title: string;
  data?: any;
  elements: DataFormElement<T>[];
  validationMessages: { [key: string]: { [key: string]: string } };
  errorMessage?: string;
  baseUrl: string;
}

export interface DataFormElement<T extends ApiResource> {
  type: DataFormElementType;
  id: string;
  name: string;
  label: string;
  validators?: ValidatorFn[];
  values?: DataFormSelectOption[];
  array?: boolean;
  dataService?: DataCrudService<T>;
  defaultValue?: any;
  disabled?: boolean;
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
