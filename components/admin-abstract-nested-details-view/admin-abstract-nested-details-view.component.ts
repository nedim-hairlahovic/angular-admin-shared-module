import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiResource } from '../../models/api-resource';
import { NestedDataService } from '../../services/nested-data.service';
import { DetailsViewRow } from '../../models/details-view';

@Component({
  template: ''
})
export abstract class AdminAbstractNestedDetailsViewComponent<T extends ApiResource> implements OnInit {
  item?: T;
  pageTitle: string = this.getTitle(null);
  errorMessage!: string;
  parentId!: string | null;
  childId!: string | null;

  constructor(private dataService: NestedDataService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(item: T | null): string;
  abstract getChildIdKey(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getOnBackUrl(): string;
  abstract getOnEditUrl(): string;

  ngOnInit(): void {
    this.pageTitle = this.getTitle(null);
    this.route.paramMap.subscribe(params => {
      this.parentId = params.get(this.getParentIdKey());
      this.childId = params.get(this.getChildIdKey());
      this.getItem();
    });
  }

  getParentIdKey(): string {
    return 'id';
  }

  getItem(): void {
    this.dataService.getSingleItem(this.parentId, this.childId).subscribe({
      next: (_item: T) => this.item = _item,
      error: err => console.log(err)
    })
  }
}
