import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DetailsViewRow } from '../../models/details-view';
import { CardButton } from '../../models/data-card';

@Component({
  selector: 'admin-details-view',
  templateUrl: './admin-details-view.component.html',
  styleUrls: ['../../admin-shared.css']
})
export class AdminDetailsViewComponent {
  @Input() id!: any;
  @Input() title!: string;
  @Input() rows: DetailsViewRow[] = [];
  @Input() buttons: CardButton[] = [
    {
      label: 'Nazad',
      icon: 'fa fa-arrow-left',
      class: 'btn-secondary',
      actionName: 'back'
    },
    {
      label: 'Uredi',
      icon: 'fa fa-pencil',
      class: 'btn-primary',
      actionName: 'edit'
    }
  ];

  @Output() btnClickEvent = new EventEmitter<any>();

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName)
  }
}
