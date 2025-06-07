import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { DataTableConfig } from "../../models/data-table";
import { NestedDataService } from "../../services/nested-data.service";
import { ApiResource } from "../../models/api-resource";
import { UrlConfig } from "../../models/url-config";

@Component({
  template: "",
  standalone: false,
})
export abstract class AdminAbstractNestedTableViewComponent<
  T extends ApiResource
> implements OnInit
{
  @Input() parentId!: number;

  dataTableConfig!: DataTableConfig;
  dataLoaded: boolean = false;
  errorMessage!: string;

  abstract getBaseUrl(): UrlConfig;
  abstract getDeletePrompt(): string;
  abstract getBackUrl(): UrlConfig;

  constructor(
    private dataService: NestedDataService<T>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataTableConfig.baseUrl = this.getBaseUrl();
    this.fetchData();
  }

  fetchData(): void {
    this.dataLoaded = false;
    this.dataService.getItems(this.parentId).subscribe({
      next: (data) => {
        this.dataTableConfig.data = data;
        this.dataLoaded = true;
      },
      error: (err) => console.log(err),
    });
  }

  deleteItem(item: T): void {
    if (confirm(this.getDeletePrompt())) {
      this.dataService.deleteItem(this.parentId, item.id).subscribe({
        next: () => this.onDelete(),
        error: (err) => (this.errorMessage = err.error.message),
      });
    }
  }

  onDelete(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([this.getBackUrl().url], {
      fragment: this.getBackUrl().fragment,
      queryParamsHandling: "preserve",
      replaceUrl: true,
    });
  }
}
