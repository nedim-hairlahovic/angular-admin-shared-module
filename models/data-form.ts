import { EventEmitter, Type } from "@angular/core";
import { FormGroup, ValidatorFn } from "@angular/forms";

import { DataCrudService } from "../services/data.service";
import { SearchableSelectItem } from "./searchable-select-item";
import { UrlConfig } from "./url-config";

// Contract for any component plugged in via DataFormElementType.Custom.
// The dynamic form engine only ever talks to this shape - it never needs
// to know about the concrete (app-specific) component implementing it.
export interface DataFormCustomFieldComponent<T = any> {
  initialValue: T | null;
  valueChange: EventEmitter<T>;
}

export interface DataFormConfig<TEntity, TForm> {
  title?: string;
  elements: DataFormElement<TForm>[];
  data?: TForm;
  routeConfig?: DataFormRouteConfig<TEntity>;
  isEditMode?: boolean;
  requestFieldMap?: FormToRequestFieldMap<TForm>;
}

export interface DataFormGroupField {
  name: string;
  label: string;
  type: DataFormElementType;
  values?: DataFormSelectOption[];
  validators?: ValidatorConfig[];
  defaultValue?: any;
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
  hidden?: boolean;
  itemComponent?: Type<any>;
  itemComponentInputsFn?: (
    item: SearchableSelectItem,
  ) => Record<string, unknown>;
  onChange?: (value: any, form: FormGroup) => void;
  groupFields?: DataFormGroupField[];
  // Used with DataFormElementType.Custom: the component rendered for this
  // field. Must satisfy DataFormCustomFieldComponent (initialValue in,
  // valueChange out) - see CustomFieldHostDirective.
  component?: Type<DataFormCustomFieldComponent>;
}

export enum DataFormControlMode {
  Control = "Control",
  Array = "Array",
  Group = "Group",
  ArrayGroup = "ArrayGroup",
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
  Radio,
  Group,
  Custom,
}

export interface DataFormRouteConfig<TEntity> {
  onSave: (item: TEntity) => UrlConfig;
  onNotFound: UrlConfig;
}

export interface ValidatorConfig {
  key: string;
  validator: ValidatorFn;
  message: string;
}
