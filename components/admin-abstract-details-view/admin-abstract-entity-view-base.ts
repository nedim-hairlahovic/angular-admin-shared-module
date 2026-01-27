import { DestroyRef, Directive, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

import { AdminErrorHandlerService } from "../../services/admin-error-handler.service";

@Directive()
export abstract class AdminAbstractEntityViewBase<
  TEntity,
  TId extends string | number = string | number,
> implements OnInit {
  entityId!: TId;
  entity!: TEntity;

  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly errorHandler = inject(AdminErrorHandlerService);
  protected readonly destroyRef = inject(DestroyRef);

  /** Route param key for this entity's id. */
  protected abstract entityIdParam(): string;

  /** Extract and validate route params (must set entityId/parentId/etc.). */
  protected abstract extractIds(params: ParamMap): void;

  /** Subclass provides how to fetch the entity (flat/nested/custom). */
  protected abstract fetch$(): Observable<TEntity>;

  /** Called after the entity is loaded; initialize title, breadcrumbs, configs, etc. */
  protected abstract onEntityLoaded(entity: TEntity): void;

  /** Called when backend returns 404 for the requested entity. */
  protected abstract onEntityNotFound(): void;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.extractIds(params);
        this.loadEntity();
      });
  }

  protected loadEntity(): void {
    this.fetch$().subscribe({
      next: (entity) => {
        this.entity = entity;
        this.onEntityLoaded(entity);
      },
      error: (err) => {
        if (err?.status === 404) {
          this.onEntityNotFound();
          return;
        }

        this.errorHandler.handleLoadError();
      },
    });
  }

  protected readIdParam(params: ParamMap, key: string): any {
    const raw = params.get(key);
    if (!raw) {
      throw new Error(`${this.constructor.name}: missing route param "${key}"`);
    }
    return /^\d+$/.test(raw) ? Number(raw) : raw;
  }
}
