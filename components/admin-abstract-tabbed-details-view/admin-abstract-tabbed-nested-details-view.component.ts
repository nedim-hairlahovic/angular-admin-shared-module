import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { ApiResource } from "../../models/api-resource";
import { NestedDataService } from "../../services/nested-data.service";
import { DetailsViewRow } from "../../models/details-view";
import AdminAbstractTabbedDetailsViewBase from "./admin-abstract-tabbed-view-base";

@Component({
  template: "",
})
export abstract class AdminAbstractTabbedNestedDetailsViewComponent<
    T extends ApiResource
  >
  extends AdminAbstractTabbedDetailsViewBase
  implements OnInit
{
  item?: T;
  errorMessage!: string;
  parentId!: string | null;
  childId!: string | null;

  constructor(
    private dataService: NestedDataService<T, any>,
    route: ActivatedRoute,
    router: Router
  ) {
    super(route, router);
  }

  abstract getTitle(item: T | null): string;
  abstract getChildIdKey(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getOnBackUrl(): string;
  abstract getOnEditUrl(): string;

  ngOnInit(): void {
    this.pageTitle = this.getTitle(null);
    this.route.paramMap.subscribe((params) => {
      this.parentId = params.get(this.getParentIdKey());
      this.childId = params.get(this.getChildIdKey());
      this.getItem();
    });
  }

  getItem(): void {
    this.dataService.getSingleItem(this.parentId, this.childId).subscribe({
      next: (_item: T) => {
        this.item = _item;
        this.pageTitle = this.getTitle(this.item);
        this.showTabs();
      },
      error: (err) => console.log(err),
    });
  }

  override navigateBack(): void {
    this.router.navigate([this.getOnBackUrl()]);
  }

  override navigateToEdit(): void {
    this.router.navigate([this.getOnEditUrl()]);
  }

  getParentIdKey(): string {
    return "id";
  }
}
