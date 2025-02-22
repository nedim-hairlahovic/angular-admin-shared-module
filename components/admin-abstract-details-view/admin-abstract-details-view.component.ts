import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailsViewRow } from '../../models/details-view';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';

@Component({
  template: ''
})
export abstract class AdminAbstractDetailsViewComponent<T extends ApiResource> implements OnInit {
  item?: T;

  constructor(private dataService: DataCrudService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getBaseUrl(): string;

  protected readonly BASE_BTN_ACTIONS: Record<string, () => void> = {
    back: () => this.navigateBack(),
    edit: () => this.navigateToEdit()
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getItem(id);
      }
    });
  }

  getItem(id: any): void {
    this.dataService.getSingleItem(id).subscribe({
      next: (_item: T) => this.item = _item,
      error: err => console.log(err)
    });
  }

  onBtnClick(actionName: any): void {
    const actionMap = this.getBtnActions();
    const action = actionMap[actionName];
    if (action) {
      action();
    }
  }

  protected getBtnActions(): Record<string, () => void> {
    return this.BASE_BTN_ACTIONS;
  }

  navigateBack(): void {
    this.router.navigate([this.getBaseUrl()]);
  }

  navigateToEdit(): void {
    const editUrl = `${this.getBaseUrl()}/${this.item?.id}/edit`;
    this.router.navigate([editUrl]);
  }
}
