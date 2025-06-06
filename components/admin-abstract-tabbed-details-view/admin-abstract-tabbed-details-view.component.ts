import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { DetailsViewRow } from "../../models/details-view";
import { DataCrudService } from "../../services/data.service";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";

@Component({
  template: "",
})
export abstract class AdminAbstractTabbedDetailsViewComponent<
    T extends ApiResource
  >
  extends AdminAbstractTabbedDetailsViewBase
  implements OnInit
{
  item?: T;
  errorMessage!: string;

  constructor(
    private dataService: DataCrudService<T>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  abstract getTitle(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getBaseUrl(): string;

  ngOnInit(): void {
    this.pageTitle = this.getTitle();
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.getItem(id);
      }
    });
  }

  getItem(id: any): void {
    this.dataService.getSingleItem(id).subscribe({
      next: (_item: T) => {
        this.item = _item;
        this.pageTitle = this.getTitle();
        this.showTabs();
      },
      error: (err) => console.log(err),
    });
  }

  override navigateBack(): void {
    this.router.navigate([this.getBaseUrl()]);
  }

  override navigateToEdit(): void {
    const editUrl = `${this.getBaseUrl()}/${this.item?.id}/edit`;
    this.router.navigate([editUrl]);
  }
}
