import { Directive } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";

import {
  DataFormConfig,
  DataFormRouteConfig,
  DataFormSelectOption,
} from "../../models/data-form";
import { ApiResource } from "../../models/api-resource";
import { UrlConfig } from "../../models/url-config";
import { BreadcrumbItem } from "../../models/breadcrumb";

@Directive()
export default abstract class AdminAbstractEditViewBase<
  T extends ApiResource,
  R
> {
  protected pageTitle!: string;
  protected formConfig!: DataFormConfig<T, R>;
  protected errorMessage!: string;

  mode: "ADD" | "EDIT" = "ADD";
  dataLoaded: boolean = false;
  processingRequest!: boolean;

  protected breadcrumbs!: BreadcrumbItem[];

  abstract getTitle(item: T): string;
  abstract convertToRequestObject(item: T): R;
  abstract extractIds(params: any): void;
  abstract getEditMode(): "ADD" | "EDIT";
  abstract getItem(): void;
  abstract getFormConfig(): DataFormConfig<T, R>;

  constructor(protected route: ActivatedRoute, protected router: Router) {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.extractIds(params);
      this.mode = this.getEditMode();
      this.formConfig = this.getFormConfig();

      this.getItem();

      this.postItemInit();
    });
  }

  initRouteConfig(baseUrl: UrlConfig): DataFormRouteConfig<T> {
    return {
      onSave: (item?: T) => baseUrl,
      onNotFound: baseUrl,
    };
  }

  protected postItemInit(): void {
    this.updateDefaultValuesFromQueryParams();
    this.getAndUpdateRelatedFormData();
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

  // Fetches and sets related form data (e.g. options for select inputs)
  protected getAndUpdateRelatedFormData(): void {}

  protected updateFormData(item: T): void {
    this.pageTitle = this.getTitle(item);

    if (this.formConfig) {
      this.formConfig.title = this.pageTitle;
      this.formConfig = {
        ...this.formConfig,
        data: this.convertToRequestObject(item),
      };
    }

    this.dataLoaded = true;
  }

  protected updateSelectValues(
    selectValues: any[],
    controlName: string,
    value: string = "value",
    label: string = "label"
  ) {
    const selectOptions = [] as DataFormSelectOption[];
    for (const selectValue of selectValues) {
      selectOptions.push({
        value: selectValue[value],
        label: selectValue[label],
      } as DataFormSelectOption);
    }

    const targetSelectInput = this.formConfig?.elements.find(
      (x: any) => x.id === controlName
    );
    if (targetSelectInput) {
      targetSelectInput.values = selectOptions;
    }
  }

  protected onSaveComplete(savedItem?: T): void {
    const urlConfig = this.resolveOnSaveUrl(savedItem);
    if (!urlConfig) return;

    this.processingRequest = false;
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
    });
  }

  private resolveOnSaveUrl(savedItem?: T): UrlConfig | null {
    const backUrl = this.getBackUrlFromQueryParams();
    if (backUrl) return backUrl;

    const urlConfig = this.formConfig.routeConfig?.onSave?.(savedItem);
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

  protected onNotFoundError(): void {
    const urlConfig = this.formConfig.routeConfig?.onNotFound;
    if (!urlConfig) {
      return;
    }

    this.processingRequest = false;
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
    });
  }

  protected handleError(err: any): void {
    this.processingRequest = false;
    this.errorMessage = err.error.message;
  }

  protected get editTitle(): string {
    return this.mode === "ADD" ? "Dodaj" : "Uredi";
  }

  protected buildEditBreadcrumbs(
    baseCrumbs: BreadcrumbItem[]
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
}
