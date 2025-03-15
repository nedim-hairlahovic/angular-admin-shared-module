import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AdminDataTableComponent } from './components/admin-data-table/admin-data-table.component';
import { AdminDataFormComponent } from './components/admin-data-form/admin-data-form.component';
import { AdminDetailsViewComponent } from './components/admin-details-view/admin-details-view.component';
import { AdminSearchableSelectComponent } from './components/admin-searchable-select/admin-searchable-select.component';
import { AdminSpinnerComponent } from './components/admin-spinner/admin-spinner.component';

@NgModule({
  declarations: [
    ClickOutsideDirective,
    AdminDataTableComponent,
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    AdminDataTableComponent,
    AdminDataFormComponent,
    AdminDetailsViewComponent,
    AdminSearchableSelectComponent,
    AdminSpinnerComponent
  ],
})
export class AdminSharedModule { }
