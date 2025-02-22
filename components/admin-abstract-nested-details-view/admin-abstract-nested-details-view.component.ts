import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiResource } from '../../models/api-resource';
import { NestedDataService } from '../../services/nested-data.service';
import { DetailsViewRow } from '../../models/details-view';
import { CardButton } from '../../models/data-card';

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

  protected readonly DEFAULT_BUTTONS: CardButton[] = [
    {
      label: 'Nazad',
      icon: 'fa fa-arrow-left',
      class: 'btn-secondary',
      actionName: 'back',
      action: () => this.navigateBack()
    },
    {
      label: 'Uredi',
      icon: 'fa fa-pencil',
      class: 'btn-primary',
      actionName: 'edit',
      action: () => this.navigateToEdit()
    }
  ];

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

  onBtnClick(actionName: any): void {
    const button = this.findButtonByActionName(actionName);
    if (button) {
      button.action();
    }
  }

  protected getButtons(): CardButton[] {
    return this.DEFAULT_BUTTONS;
  }

  findButtonByActionName(actionName: string): CardButton | undefined {
    return this.getButtons().find(button => button.actionName === actionName);
  }

  navigateBack(): void {
    this.router.navigate([this.getOnBackUrl()]);
  }

  navigateToEdit(): void {
    this.router.navigate([this.getOnEditUrl()]);
  }
}
