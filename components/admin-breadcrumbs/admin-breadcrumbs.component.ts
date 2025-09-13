import { Component, Input } from "@angular/core";

import { BreadcrumbItem } from "../../models/breadcrumb";

@Component({
  selector: "admin-breadcrumbs",
  templateUrl: "./admin-breadcrumbs.component.html",
  styleUrl: "./admin-breadcrumbs.component.css",
  standalone: false,
})
export class AdminBreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
