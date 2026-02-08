import { Directive, OnInit } from "@angular/core";
import { ParamMap } from "@angular/router";
import { map, Observable, switchMap } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";
import { BaseCrudService } from "../../services/base-crud.service";
import { BreadcrumbItem } from "../../models/breadcrumb";

@Directive()
export abstract class AdminAbstractNestedEditViewComponent<
  TEntity extends ApiResource,
  TRequest,
  TForm,
  TParentId extends any = number,
  TParent extends ApiResource = any,
>
  extends AdminAbstractEditViewBase<TEntity, TRequest, TForm>
  implements OnInit
{
  parentId!: any;
  parent!: TParent;

  constructor(
    private parentDataService: BaseCrudService<TParent>,
    private dataService: NestedDataService<TEntity, TRequest, TParentId>,
  ) {
    super();
  }

  /** Route param key for this entity id. */
  protected abstract override entityIdParam(): string;

  /** Route param key for the parent entity id. */
  protected parentIdParam(): string {
    return "id";
  }

  protected override extractIds(params: ParamMap): void {
    this.parentId = this.resolveParentId(params);
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }

  protected resolveParentId(params: ParamMap): TParentId {
    return this.readIdParam(params, this.parentIdParam());
  }

  protected override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.parentId, this.entityId);
  }

  override loadEntity(): void {
    this.dataLoaded = false;

    this.parentDataService
      .fetch(...this.normalizeId(this.parentId))
      .pipe(
        switchMap((parent: TParent) =>
          this.dataService
            .fetch(this.parentId, this.entityId)
            .pipe(map((entity: TEntity) => ({ parent, entity }))),
        ),
      )
      .subscribe({
        next: ({ parent, entity }) => {
          this.parent = parent;
          this.onEntityLoaded(entity);
        },
        error: () => this.errorHandler.handleLoadError(),
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

  onSave(formData: TForm): void {
    this.processingRequest = true;

    const request = this.mapToRequest(formData);

    const request$ =
      this.mode === "ADD"
        ? this.dataService.create(this.parentId as TParentId, request)
        : this.dataService.update(
            this.parentId as TParentId,
            this.entityId,
            request,
          );

    request$.subscribe({
      next: (saved: TEntity) => this.onSaveComplete(saved),
      error: (err) => this.handleError(err),
    });
  }

  protected buildBreadcrumbs<T extends { id?: number | string }>(
    entity: T,
    baseTitle: string,
    baseUrl: string,
    getEntityLabel: (entity: T) => string,
    section: { title: string; fragment: string },
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
