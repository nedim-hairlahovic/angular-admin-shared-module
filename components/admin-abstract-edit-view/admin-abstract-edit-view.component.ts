import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";
import { BreadcrumbItem } from "../../models/breadcrumb";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractEditViewComponent<
  T extends ApiResource,
  R,
> extends AdminAbstractEditViewBase<T, R> {
  itemId!: string;

  constructor(private dataService: DataCrudService<T, R>) {
    super();
  }

  override extractIds(params: any): void {
    this.itemId = params.get("id");
  }

  override getEditMode(): "ADD" | "EDIT" {
    return this.itemId === "0" ? "ADD" : "EDIT";
  }

  override getItem(): void {
    this.dataLoaded = false;
    this.dataService.getSingleItem(this.itemId).subscribe({
      next: (item: T) => {
        this.updateFormData(item);
        this.breadcrumbs = this.initBreadcrumbs(item);
      },
      error: (err) => {
        if (err.status === 404) {
          this.onNotFoundError();
        }

        this.handleError(err);
      },
    });
  }

  onSave(requestDto: R): void {
    this.processingRequest = true;
    this.sanitizeRequestObject(requestDto);

    const request$ =
      this.mode === "ADD"
        ? this.dataService.createItem(requestDto)
        : this.dataService.updateItem(this.itemId, requestDto);

    request$.subscribe({
      next: (saved: T) => this.onSaveComplete(saved),
      error: (err: HttpErrorResponse) => this.handleError(err),
    });
  }

  protected sanitizeRequestObject(requestDto: R): void {}

  protected initBreadcrumbs(item: T): BreadcrumbItem[] {
    return [];
  }
}
