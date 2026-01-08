import { NgModule } from "@angular/core";
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
import { AdminModalComponent } from "./components/admin-modal/admin-modal.component";
import { AdminToastContainerComponent } from "./components/admin-toast-container/admin-toast-container.component";
import { AdminConfirmDialogComponent } from "./components/admin-confirm-dialog/admin-confirm-dialog.component";
import { AdminConfirmDialogHostComponent } from "./components/admin-confirm-dialog-host/admin-confirm-dialog-host.component";

const ADMIN_SHARED_STANDALONE = [
  AdminDataTableComponent,
  AdminBreadcrumbsComponent,
  TooltipDirective,
];

@NgModule({
  declarations: [
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminModalComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent,
    AdminTabbedDetailsViewTemplateComponent,
    AdminToastContainerComponent,
    AdminConfirmDialogComponent,
    AdminConfirmDialogHostComponent,
    ClickOutsideDirective,
  ],
  exports: [
    ...ADMIN_SHARED_STANDALONE,
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminModalComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent,
    AdminTabbedDetailsViewTemplateComponent,
    AdminToastContainerComponent,
    AdminConfirmDialogComponent,
    AdminConfirmDialogHostComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule,
    ...ADMIN_SHARED_STANDALONE,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AdminSharedModule {}
