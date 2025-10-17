import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { ClickOutsideDirective } from "./directives/click-outside.directive";
import { AdminDataTableComponent } from "./components/admin-data-table/admin-data-table.component";
import { AdminDataFormComponent } from "./components/admin-data-form/admin-data-form.component";
import { AdminDetailsViewComponent } from "./components/admin-details-view/admin-details-view.component";
import { AdminSearchableSelectComponent } from "./components/admin-searchable-select/admin-searchable-select.component";
import { AdminSpinnerComponent } from "./components/admin-spinner/admin-spinner.component";
import { AdminTabbedDetailsViewTemplateComponent } from "./components/admin-abstract-tabbed-details-view/admin-tabbed-details-view-template.component";
import { AdminBreadcrumbsComponent } from "./components/admin-breadcrumbs/admin-breadcrumbs.component";
import { TooltipDirective } from "./directives/tooltip.directive";

@NgModule({
  declarations: [
    AdminDataTableComponent,
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent,
    AdminTabbedDetailsViewTemplateComponent,
    AdminBreadcrumbsComponent,
    ClickOutsideDirective,
    TooltipDirective,
  ],
  exports: [
    AdminDataTableComponent,
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent,
    AdminTabbedDetailsViewTemplateComponent,
    AdminBreadcrumbsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    CommonModule,
    RouterModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AdminSharedModule {}
