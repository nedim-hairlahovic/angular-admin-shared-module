import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedEditViewComponent<
    T extends ApiResource,
    R,
    ID = number
  >
  extends AdminAbstractEditViewBase<T, R>
  implements OnInit
{
  parentId!: ID;
  childId!: string | null;

  abstract getChildIdKey(): string;

  constructor(
    private dataService: NestedDataService<T, R, ID>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  override extractIds(params: ParamMap): void {
    this.parentId = this.resolveParentId(params);
    this.childId = params.get(this.getChildIdKey());
  }

  override getEditMode(): "ADD" | "EDIT" {
    return this.childId === "0" ? "ADD" : "EDIT";
  }

  protected resolveParentId(params: ParamMap): ID {
    const raw = params.get(this.getParentIdKey());
    if (raw === null) return {} as ID;

    if (/^\d+$/.test(raw)) {
      return Number.parseInt(raw) as ID;
    }
    return {} as ID;
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

  onSave(requestDto: R): void {
    this.processingRequest = true;

    if (this.mode === "ADD") {
      this.dataService.createItem(this.parentId, requestDto).subscribe({
        next: () => this.onSaveComplete(),
        error: (err) => this.handleError(err),
      });
    } else if (this.mode === "EDIT") {
      this.dataService
        .updateItem(this.parentId, this.childId, requestDto)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: (err) => this.handleError(err),
        });
    }
  }
}
