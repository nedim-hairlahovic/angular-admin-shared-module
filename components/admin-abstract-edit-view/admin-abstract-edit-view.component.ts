import { Directive } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ParamMap } from "@angular/router";
import { Observable } from "rxjs";

import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractEditViewBase from "./admin-abstract-edit-view-base";

@Directive()
export abstract class AdminAbstractEditViewComponent<
  TEntity extends ApiResource,
  TRequest,
  TForm,
> extends AdminAbstractEditViewBase<TEntity, TRequest, TForm> {
  constructor(private dataService: DataCrudService<TEntity, TRequest>) {
    super();
  }

  protected override fetch$(): Observable<TEntity> {
    return this.dataService.fetch(this.entityId);
  }

  override entityIdParam(): string {
    return "id";
  }

  protected override extractIds(params: ParamMap): void {
    this.entityId = this.readIdParam(params, this.entityIdParam());
  }

  onSave(formData: TForm): void {
    this.processingRequest = true;

    const request = this.mapToRequest(formData);

    const request$ =
      this.mode === "ADD"
        ? this.dataService.create(request)
        : this.dataService.update(this.entityId, request);

    request$.subscribe({
      next: (saved: TEntity) => this.onSaveComplete(saved),
      error: (err: HttpErrorResponse) => this.handleError(err),
    });
  }

  protected buildDefaultTitle(entityLabel: string, titleValue: string): string {
    const base = `${this.editTitle} ${entityLabel}`;
    return this.mode === "EDIT" ? `${base}: ${titleValue}` : base;
  }
}
