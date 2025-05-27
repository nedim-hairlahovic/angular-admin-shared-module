import { Type } from "@angular/core";

export interface AdminTabConfig {
  label: string;
  id: string;
  component: Type<any>;
  inputs?: { [key: string]: any };
  outputs?: { [key: string]: (event: any) => void };
}
