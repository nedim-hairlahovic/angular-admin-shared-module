import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";
import { BaseCrudService } from "../../services/base-crud.service";
import { map, switchMap } from "rxjs";
import { BreadcrumbItem } from "../../models/breadcrumb";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedEditViewComponent<
    T extends ApiResource,
    R,
    ID = number,
    P extends ApiResource = any
  >
  extends AdminAbstractEditViewBase<T, R>
  implements OnInit
{
  parentId!: ID;
  childId!: string | null;

  abstract getChildIdKey(): string;

  constructor(
    private parentDataService: BaseCrudService<P>,
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

    this.parentDataService
      .getSingleItem(...this.normalizeId(this.parentId))
      .pipe(
        switchMap((parent: P) =>
          this.dataService
            .getSingleItem(this.parentId, this.childId)
            .pipe(map((child: T) => ({ parent, child })))
        )
      )
      .subscribe({
        next: ({ parent, child }) => {
          this.updateFormData(child);
          this.breadcrumbs = this.initBreadcrumbs(parent, child);
        },
        error: (err) => console.log(err),
      });
  }

  private normalizeId(id: any): any[] {
    if (typeof id === "object") {
      // If the ID is a composite object, convert its property values into an array.
      // Example: { part1: 10, part2: "A" } → [10, "A"]
      return Object.values(id);
    }
    // If the ID is a simple value, wrap it in an array so it can be spread into getSingleItem(...ids).
    return [id];
  }

  onSave(requestDto: R): void {
    this.processingRequest = true;

    if (this.mode === "ADD") {
      this.dataService.createItem(this.parentId, requestDto).subscribe({
        next: (saved: T) => this.onSaveComplete(saved),
        error: (err) => this.handleError(err),
      });
    } else if (this.mode === "EDIT") {
      this.dataService
        .updateItem(this.parentId, this.childId, requestDto)
        .subscribe({
          next: (saved: T) => this.onSaveComplete(saved),
          error: (err) => this.handleError(err),
        });
    }
  }

  protected initBreadcrumbs(parent: P, child: T): BreadcrumbItem[] {
    return [];
  }

  protected buildBreadcrumbs<T extends { id?: number | string }>(
    entity: T,
    baseTitle: string,
    baseUrl: string,
    getEntityLabel: (entity: T) => string,
    section: { title: string; fragment: string }
  ): BreadcrumbItem[] {
    return [
      { title: baseTitle, url: baseUrl },
      { title: getEntityLabel(entity), url: `${baseUrl}${entity.id}` },
      {
        title: section.title,
        url: `${baseUrl}${entity.id}`,
        fragment: section.fragment,
      },
      { title: this.editTitle, active: true },
    ];
  }
}
