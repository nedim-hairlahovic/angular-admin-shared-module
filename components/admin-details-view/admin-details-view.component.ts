import { Component, EventEmitter, Input, Output } from "@angular/core";

import { DetailsViewData } from "../../models/details-view";
import { CardButton } from "../../models/data-card";

@Component({
  selector: "admin-details-view",
  templateUrl: "./admin-details-view.component.html",
  styleUrls: ["../../admin-shared.css", "./admin-details-view.component.css"],
  standalone: true,
})
export class AdminDetailsViewComponent {
  @Input() data!: DetailsViewData;
  @Input() buttons: CardButton[] = [];

  @Output() btnClickEvent = new EventEmitter<any>();

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName);
  }
}
