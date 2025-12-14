import {
  ComponentRef,
  Directive,
  EventEmitter,
  inject,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { AdminTabConfig } from "../../models/tabbed-view";
import { CardButton } from "../../models/data-card";
import { BreadcrumbItem } from "../../models/breadcrumb";
import {
  DetailsViewConfigRouteConfig,
  DetailsViewData,
} from "../../models/details-view";
import { ApiResource } from "../../models/api-resource";
import { AdminErrorHandlerService } from "../../services/admin-error-handler.service";

@Directive()
export default abstract class AdminAbstractTabbedDetailsViewBase<
  T extends ApiResource
> {
  protected item!: T;
  protected errorMessage!: string;
  protected pageTitle!: string;
  protected routeConfig!: DetailsViewConfigRouteConfig<T>;
  protected tabs!: AdminTabConfig[];
  protected selectedIndex = 0;

  @ViewChild("dynamicComponentHost", { read: ViewContainerRef })
  protected hostRef!: ViewContainerRef;

  protected breadcrumbs!: BreadcrumbItem[];

  protected DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Uredi",
      icon: "fa fa-pencil",
      class: "btn-primary",
      actionName: "edit",
      action: () => this.navigateToEdit(),
    },
  ];

  abstract getTitle(): string;
  abstract initTabs(): void;
  abstract getDetailsData(): DetailsViewData;
  abstract getRouteConfig(): DetailsViewConfigRouteConfig<T>;
  protected abstract ngOnInit(): void;

  protected readonly errorHandler = inject(AdminErrorHandlerService);

  constructor(protected route: ActivatedRoute, protected router: Router) {}

  protected showTabs() {
    this.initTabs();
    this.setActiveTab();

    setTimeout(() => {
      this.loadTabComponent(this.tabs[this.selectedIndex]);
    });
  }

  protected setActiveTab(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const tabIndex = this.tabs.findIndex(
          (tab) => tab.id.toLowerCase() === fragment.toLowerCase()
        );
        if (tabIndex !== -1) {
          this.selectedIndex = tabIndex;
        }
      }
    });
  }

  protected loadTabComponent(tab: AdminTabConfig): void {
    if (!this.hostRef) return;

    this.hostRef.clear();

    const componentRef: ComponentRef<any> = this.hostRef.createComponent(
      tab.component
    );

    // Apply inputs manually, i.e. assign @Input() values
    Object.entries(tab.inputs || {}).forEach(([key, value]) => {
      componentRef.instance[key] = value;
    });

    // Assign @Output() handlers generically
    Object.entries(tab.outputs || {}).forEach(([outputKey, handler]) => {
      const output = (componentRef.instance as any)[outputKey];
      if (output instanceof EventEmitter) {
        output.subscribe(handler);
      }
    });

    // Trigger change detection if needed
    componentRef.changeDetectorRef.detectChanges();
  }

  protected onTabClick(index: number): void {
    this.selectedIndex = index;
    this.loadTabComponent(this.tabs[index]);
    this.updateUrlFragment(this.tabs[index]);
  }

  protected updateUrlFragment(tab: AdminTabConfig): void {
    const fragment = tab.id.toLowerCase();

    this.router.navigate([], {
      fragment,
      queryParamsHandling: "preserve",
      replaceUrl: true,
    });
  }

  protected getButtons(): CardButton[] {
    return this.DEFAULT_BUTTONS;
  }

  protected onBtnClick(actionName: string): void {
    const button = this.getButtons().find((b) => b.actionName === actionName);
    if (button) {
      button.action();
    }
  }

  protected navigateToEdit(): void {
    if (this.routeConfig?.edit) {
      const urlConfig = this.routeConfig.edit(this.item);
      this.router.navigate([urlConfig.url], {
        fragment: urlConfig.fragment,
      });
    }
  }

  protected onNotFoundError(): void {
    const urlConfig = this.routeConfig?.onNotFound;
    if (!urlConfig) {
      return;
    }
    this.router.navigate([urlConfig.url], {
      fragment: urlConfig.fragment,
    });
  }
}
