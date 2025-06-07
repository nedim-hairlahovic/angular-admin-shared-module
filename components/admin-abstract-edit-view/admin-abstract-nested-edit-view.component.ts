import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedEditViewComponent<
    T extends ApiResource,
    R
  >
  extends AdminAbstractEditViewBase<T, R>
  implements OnInit
{
  parentId!: string | null;
  childId!: string | null;

  abstract getChildIdKey(): string;

  constructor(
    private dataService: NestedDataService<T>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  override extractIds(params: any): void {
    this.parentId = params.get(this.getParentIdKey());
    this.childId = params.get(this.getChildIdKey());
  }

  override getEditMode(): "ADD" | "EDIT" {
    return this.childId === "0" ? "ADD" : "EDIT";
  }

  protected getParentIdKey(): string {
    return "id";
  }

  override getItem(): void {
    this.dataLoaded = false;
    this.dataService.getSingleItem(this.parentId, this.childId).subscribe({
      next: (item: T) => this.updateFormData(item),
      error: (err) => console.log(err),
    });
    this.getAndUpdateRelatedFormData();
  }

  onSave(item: T): void {
    this.processingRequest = true;

    if (this.mode === "ADD") {
      this.dataService.createItem(this.parentId, item).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => this.handleError(err),
      });
    } else if (this.mode === "EDIT") {
      this.dataService.updateItem(this.parentId, this.childId, item).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => this.handleError(err),
      });
    }
  }
}
