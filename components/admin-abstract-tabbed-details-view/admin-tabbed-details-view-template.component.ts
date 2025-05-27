import { Component, Input, OnInit } from "@angular/core";

import { AdminTabConfig } from "../../models/tabbed-view";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";

@Component({
  selector: "admin-tabbed-details-view-template",
  templateUrl: "./admin-tabbed-details-view-template.component.html",
  styleUrl: "../../admin-shared.css",
  standalone: false,
})
export class AdminTabbedDetailsViewTemplateComponent
  extends AdminAbstractTabbedDetailsViewBase
  implements OnInit
{
  @Input() override tabs!: AdminTabConfig[];
  @Input() override pageTitle!: string;

  ngOnInit(): void {
    this.showTabs();
  }

  override initTabs(): void {}
  override navigateBack(): void {}
  override navigateToEdit(): void {}
}
