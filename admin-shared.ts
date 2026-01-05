import { OnInit } from "@angular/core";

import { AdminMenu } from "./models/menu";

export abstract class AdminSharedBaseComponent implements OnInit {
  isSidebarToggled = false;
  currentYear = new Date().getFullYear();

  abstract menu: AdminMenu;

  ngOnInit(): void {
    this.isSidebarToggled = localStorage.getItem("sidebar:toggled") === "true";
  }

  toggleSidebar(): void {
    this.isSidebarToggled = !this.isSidebarToggled;
    localStorage.setItem("sidebar:toggled", String(this.isSidebarToggled));
  }
}
