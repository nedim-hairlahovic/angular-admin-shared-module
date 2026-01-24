import { Type } from "@angular/core";

import { ApiResource } from "./api-resource";
import { DetailsViewConfigRouteConfig } from "./details-view";

export interface TabbedDetailsViewConfig<TEntity extends ApiResource> {
  tabs: AdminTabConfig[];
  routeConfig: DetailsViewConfigRouteConfig<TEntity>;
}

export interface AdminTabConfig {
  label: string;
  id: string;
  component: Type<any>;
  inputs?: { [key: string]: any };
  outputs?: { [key: string]: (event: any) => void };
}
