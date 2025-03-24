import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DetailsViewRow } from '../../models/details-view';
import { CardButton } from '../../models/data-card';

@Component({
    selector: 'admin-details-view',
    templateUrl: './admin-details-view.component.html',
    styleUrls: ['../../admin-shared.css'],
    standalone: false
})
export class AdminDetailsViewComponent {
  @Input() id!: any;
  @Input() title!: string;
  @Input() rows: DetailsViewRow[] = [];
  @Input() buttons: CardButton[] = [];

  @Output() btnClickEvent = new EventEmitter<any>();

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName)
  }
}
