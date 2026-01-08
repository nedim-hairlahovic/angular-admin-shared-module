import { Component, Input } from "@angular/core";

import { BreadcrumbItem } from "../../models/breadcrumb";
import { RouterLink } from "@angular/router";

@Component({
  selector: "admin-breadcrumbs",
  templateUrl: "./admin-breadcrumbs.component.html",
  styleUrl: "./admin-breadcrumbs.component.css",
  imports: [RouterLink],
  standalone: true,
})
export class AdminBreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
