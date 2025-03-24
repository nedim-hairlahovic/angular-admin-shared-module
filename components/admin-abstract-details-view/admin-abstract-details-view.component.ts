import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DetailsViewRow } from '../../models/details-view';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';
import { CardButton } from '../../models/data-card';

@Component({
    template: '',
    standalone: false
})
export abstract class AdminAbstractDetailsViewComponent<T extends ApiResource> implements OnInit {
  item?: T;

  constructor(private dataService: DataCrudService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getBaseUrl(): string;

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
    this.router.navigate([this.getBaseUrl()]);
  }

  navigateToEdit(): void {
    const editUrl = `${this.getBaseUrl()}/${this.item?.id}/edit`;
    this.router.navigate([editUrl]);
  }
}
