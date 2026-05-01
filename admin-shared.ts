import { Directive, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { inject } from "@angular/core";

import { AdminMenu, AdminMenuItem } from "./models/menu";

@Directive()
export abstract class AdminSharedBaseComponent implements OnInit {
  isSidebarToggled = false;
  currentYear = new Date().getFullYear();

  abstract menu: AdminMenu;

  private readonly router = inject(Router);
  private readonly openGroups = new Set<string>();

  ngOnInit(): void {
    this.isSidebarToggled = localStorage.getItem("sidebar:toggled") === "true";
    this.menu.items.forEach((item) => {
      if (
        item.children?.some((child) => this.router.isActive(child.route, false))
      ) {
        this.openGroups.add(item.title);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarToggled = !this.isSidebarToggled;
    localStorage.setItem("sidebar:toggled", String(this.isSidebarToggled));
  }

  isGroupOpen(item: AdminMenuItem): boolean {
    return this.openGroups.has(item.title);
  }

  isGroupActive(item: AdminMenuItem): boolean {
    return (
      item.children?.some((child) =>
        this.router.isActive(child.route, false),
      ) ?? false
    );
  }

  toggleGroup(item: AdminMenuItem): void {
    if (this.openGroups.has(item.title)) {
      this.openGroups.delete(item.title);
    } else {
      this.openGroups.add(item.title);
    }
  }
}
