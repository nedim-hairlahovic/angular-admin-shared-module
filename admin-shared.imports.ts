import { AdminBreadcrumbsComponent } from "./components/admin-breadcrumbs/admin-breadcrumbs.component";
import { AdminDataTableComponent } from "./components/admin-data-table/admin-data-table.component";

export const ADMIN_ABSTRACT_TABLE_VIEW_IMPORTS = [
  AdminDataTableComponent,
  AdminBreadcrumbsComponent,
] as const;
