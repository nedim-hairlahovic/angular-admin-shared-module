import {
  ComponentRef,
  Directive,
  EventEmitter,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { AdminTabConfig } from "../../models/tabbed-view";
import { CardButton } from "../../models/data-card";
import { ActivatedRoute, Router } from "@angular/router";

@Directive()
export default abstract class AdminAbstractTabbedDetailsViewBase {
  protected pageTitle!: string;
  protected tabs!: AdminTabConfig[];
  protected selectedIndex = 0;

  @ViewChild("dynamicComponentHost", { read: ViewContainerRef })
  protected hostRef!: ViewContainerRef;

  protected DEFAULT_BUTTONS: CardButton[] = [
    {
      label: "Nazad",
      icon: "fa fa-arrow-left",
      class: "btn-secondary",
      actionName: "back",
      action: () => this.navigateBack(),
    },
    {
      label: "Uredi",
      icon: "fa fa-pencil",
      class: "btn-primary",
      actionName: "edit",
      action: () => this.navigateToEdit(),
    },
  ];

  abstract initTabs(): void;
  abstract navigateBack(): void;
  abstract navigateToEdit(): void;

  constructor(protected route: ActivatedRoute, protected router: Router) {}

  protected abstract ngOnInit(): void;

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
}
