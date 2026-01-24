import {
  ComponentRef,
  Directive,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";

import {
  AdminTabConfig,
  TabbedDetailsViewConfig,
} from "../../models/tabbed-view";
import { ApiResource } from "../../models/api-resource";
import { AdminAbstractDetailsViewBase } from "../admin-abstract-details-view/admin-abstract-details-view.base";

@Directive()
export default abstract class AdminAbstractTabbedDetailsViewBase<
  TEntity extends ApiResource,
> extends AdminAbstractDetailsViewBase<TEntity> {
  protected config!: TabbedDetailsViewConfig<TEntity>;
  protected selectedIndex = 0;

  @ViewChild("dynamicComponentHost", { read: ViewContainerRef })
  protected hostRef!: ViewContainerRef;

  abstract tabs(): AdminTabConfig[];

  protected showTabs() {
    this.setActiveTab();

    setTimeout(() => {
      this.loadTabComponent(this.config.tabs[this.selectedIndex]);
    });
  }

  protected setActiveTab(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        const tabIndex = this.config.tabs.findIndex(
          (tab) => tab.id.toLowerCase() === fragment.toLowerCase(),
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
      tab.component,
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
    this.loadTabComponent(this.config.tabs[index]);
    this.updateUrlFragment(this.config.tabs[index]);
  }

  protected updateUrlFragment(tab: AdminTabConfig): void {
    const fragment = tab.id.toLowerCase();

    this.router.navigate([], {
      fragment,
      queryParamsHandling: "preserve",
      replaceUrl: true,
    });
  }
}
