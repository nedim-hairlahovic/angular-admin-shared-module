import { AdminBreadcrumbsComponent } from "./components/admin-breadcrumbs/admin-breadcrumbs.component";
import { AdminDataFormComponent } from "./components/admin-data-form/admin-data-form.component";
import { AdminDataTableComponent } from "./components/admin-data-table/admin-data-table.component";
import { AdminDetailsViewComponent } from "./components/admin-details-view/admin-details-view.component";

export const ADMIN_ABSTRACT_TABLE_VIEW_IMPORTS = [
  AdminDataTableComponent,
  AdminBreadcrumbsComponent,
] as const;

export const ADMIN_ABSTRACT_DETAILS_VIEW_IMPORTS = [
  AdminDetailsViewComponent,
  AdminBreadcrumbsComponent,
] as const;

export const ADMIN_ABSTRACT_EDIT_VIEW_IMPORTS = [
  AdminDataFormComponent,
  AdminBreadcrumbsComponent,
] as const;
