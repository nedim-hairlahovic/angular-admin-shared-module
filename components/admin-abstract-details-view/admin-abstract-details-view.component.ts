import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DetailsViewRow } from '../../models/details-view';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';

@Component({
  template: ''
})
export abstract class AdminAbstractDetailsViewComponent<T extends ApiResource> implements OnInit {
  item?: T;

  constructor(private dataService: DataCrudService<T>, private route: ActivatedRoute) { }

  abstract getTitle(): string;
  abstract getDetailsData(): DetailsViewRow[];
  abstract getOnBackUrl(): string;

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

}
