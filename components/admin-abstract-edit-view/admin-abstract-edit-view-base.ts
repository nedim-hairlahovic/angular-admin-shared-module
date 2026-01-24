import { Directive, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

import {
  DataFormConfig,
  DataFormElement,
  DataFormRouteConfig,
  DataFormSelectOption,
  FormToRequestFieldMap,
} from "../../models/data-form";
import { ApiResource } from "../../models/api-resource";
import { UrlConfig } from "../../models/url-config";
import { BreadcrumbItem } from "../../models/breadcrumb";
import { AdminToastService } from "../../services/admin-toast.service";
import { AdminErrorMessageService } from "../../services/admin-error-message.service";
import { ADMIN_BACKEND_ADAPTER } from "../../config/backend/backend-adapter";
import { AdminAbstractEntityViewBase } from "../admin-abstract-details-view/admin-abstract-entity-view-base";

@Directive()
export default abstract class AdminAbstractEditViewBase<
  TEntity extends ApiResource,
  TRequest,
  TForm,
> extends AdminAbstractEntityViewBase<TEntity, any> {
  protected pageTitle!: string;
  protected formConfig!: DataFormConfig<TEntity, TForm>;
  protected breadcrumbItems: BreadcrumbItem[] = [];

  mode: "ADD" | "EDIT" = "ADD";
  dataLoaded: boolean = false;
  processingRequest!: boolean;
  backendFieldErrors: Record<string, string> | null = null;

  abstract formElements(): DataFormElement<TForm>[];
  abstract routeConfig(): DataFormRouteConfig<TEntity>;
  abstract title(entity: TEntity): string;
  abstract mapToFormData(entity: TEntity): TForm;
  abstract getSaveSuccessMessage(entity: TEntity): string;

  protected readonly toast = inject(AdminToastService);
  protected readonly errorMessageService = inject(AdminErrorMessageService);
  private readonly backendAdapter = inject(ADMIN_BACKEND_ADAPTER);

  protected override onEntityLoaded(entity: TEntity): void {
    this.mode = this.resolveMode();
    const elements = this.formElements();
    const routeConfig = this.routeConfig();

    this.verifyFormConfig(elements, routeConfig);

    this.formConfig = {
      elements,
      routeConfig,
      isEditMode: this.mode === "EDIT",
    };

    this.updateDefaultValuesFromQueryParams();
    this.fetchAndBindRelatedFormData();
  }

  private resolveMode(): "ADD" | "EDIT" {
    return this.entityId === "0" ? "ADD" : "EDIT";
  }

  protected verifyFormConfig(
    elements: DataFormElement<TForm>[],
    routeConfig: DataFormRouteConfig<TEntity> | null,
  ): void {
    if (!elements || elements.length === 0) {
      throw new Error(
        `${this.constructor.name}: formElements() must return at least one element`,
      );
    }

    if (!routeConfig) {
      throw new Error(
        `${this.constructor.name}: routeConfig() must be provided`,
      );
    }
  }

  protected updateDefaultValuesFromQueryParams(): void {
    // Subscribe to query params and update default values in form configuration
    this.route.queryParamMap.subscribe((params) => {
      this.formConfig.elements.forEach((element) => {
        const paramValue = params.get(element.name);
        if (paramValue) {
          element.defaultValue = paramValue;
        }
      });
    });
  }

  protected updateFormData(entity: TEntity): void {
    this.pageTitle = this.title(entity);

    const formData = this.mapToFormData(entity);

    this.formConfig = {
      ...this.formConfig,
      title: this.pageTitle,
      data: formData,
      requestFieldMap: this.mapFormToRequestFields(formData),
    };
  }

  // Fetches and sets related form data (e.g. options for select inputs)
  protected fetchAndBindRelatedFormData(): void {}

  protected mapToRequest(form: TForm): TRequest {
    // Default: form shape matches request DTO
    return form as unknown as TRequest;
  }

  protected mapFormToRequestFields(form: TForm): FormToRequestFieldMap<TForm> {
    const map: FormToRequestFieldMap<TForm> = {};

    for (const key of Object.keys(form as object) as Array<
      Extract<keyof TForm, string>
    >) {
      map[key] = key; // default: same field name
    }

    return map;
  }

  protected updateSelectValues(
    selectValues: any[],
    controlName: string,
    value: string = "value",
    label: string = "label",
  ) {
    const selectOptions = [] as DataFormSelectOption[];
    for (const selectValue of selectValues) {
      selectOptions.push({
        value: selectValue[value],
        label: selectValue[label],
      } as DataFormSelectOption);
    }

    const targetSelectInput = this.formConfig?.elements.find(
      (x: any) => x.id === controlName,
    );
    if (targetSelectInput) {
      targetSelectInput.values = selectOptions;
    }
  }

  protected onSaveComplete(savedEntity: TEntity): void {
    const urlConfig = this.resolveOnSaveUrl(savedEntity);
    if (!urlConfig) return;

    this.processingRequest = false;
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
    });

    this.toast.success(this.getSaveSuccessMessage(savedEntity));
  }

  private resolveOnSaveUrl(savedEntity: TEntity): UrlConfig | null {
    const backUrl = this.getBackUrlFromQueryParams();
    if (backUrl) return backUrl;

    const urlConfig = this.formConfig.routeConfig?.onSave?.(savedEntity);
    if (!urlConfig) {
      return null;
    }

    return urlConfig;
  }

  private getBackUrlFromQueryParams(): UrlConfig | null {
    const backRaw = this.route.snapshot.queryParamMap.get("back");
    if (!backRaw) return null;

    try {
      const back = decodeURIComponent(backRaw);
      const [url, fragment] = back.split("#");
      return { url, fragment: fragment || undefined };
    } catch (e) {
      return null;
    }
  }

  override onEntityNotFound(): void {
    const notFoundRoute = this.formConfig.routeConfig?.onNotFound;

    if (!notFoundRoute) {
      this.errorHandler.handleLoadError();
      return;
    }

    const { url, fragment } = notFoundRoute;
    this.router.navigate([url], { fragment });
  }

  protected handleError(err: HttpErrorResponse): void {
    this.processingRequest = false;

    const backendError = this.backendAdapter.mapError(err);

    if (err.status === 400 || err.status === 409) {
      const fe = backendError?.fieldErrors;

      if (fe) {
        this.backendFieldErrors = Object.fromEntries(
          Object.entries(fe).map(([field, e]) => [
            field,
            this.errorMessageService.backendErrorToUserMessage(e) ?? "",
          ]),
        );
      }

      this.toast.error(
        "Neuspješno spremanje podataka. Molimo ispravite označena polja.",
      );
    } else {
      this.toast.error("Dogodila se greška. Pokušajte ponovo.");
    }
  }

  protected get editTitle(): string {
    return this.mode === "ADD" ? "Dodaj" : "Uredi";
  }

  buildDefaultRouteConfig(baseUrl: UrlConfig): DataFormRouteConfig<TEntity> {
    return {
      onSave: (entity: TEntity) => baseUrl,
      onNotFound: baseUrl,
    };
  }

  protected breadcrumbs(entity: TEntity): BreadcrumbItem[] {
    return [];
  }

  protected buildEditBreadcrumbs(
    baseCrumbs: BreadcrumbItem[],
  ): BreadcrumbItem[] {
    // clone to avoid mutating original
    const breadcrumbs = [...baseCrumbs];

    if (this.mode === "ADD") {
      // In ADD mode: remove the last item (detail breadcrumb)
      breadcrumbs.pop();
    }

    // Always add the final breadcrumb (e.g. "Uredi" or "Dodaj")
    breadcrumbs.push({ title: this.editTitle, active: true });

    return breadcrumbs;
  }

  protected loadSelectOptions<T>(
    source$: Observable<T[]>,
    controlName: string,
    valueKey: string,
    labelKey: string,
    onError?: (err: any) => void,
  ): void {
    source$.subscribe({
      next: (data) => {
        this.updateSelectValues(
          data,
          controlName,
          valueKey as string,
          labelKey as string,
        );
      },
      error: (err) => {
        if (onError) {
          onError(err);
        } else {
          this.handleSelectLoadError(err, controlName);
        }
      },
    });
  }

  protected handleSelectLoadError(err?: any, controlName?: string): void {
    this.toast.error(
      "Greška prilikom učitavanja povezanih podataka. Formu trenutno nije moguće ispravno popuniti.",
      "Greška",
      0,
    );
  }
}
