import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ConfirmDialogOptions } from "../../models/confirm-dialog";

@Component({
  selector: "admin-confirm-dialog",
  templateUrl: "./admin-confirm-dialog.component.html",
  styleUrls: ["../../admin-shared.css"],
  standalone: true,
})
export class AdminConfirmDialogComponent {
  @Input() options!: ConfirmDialogOptions;
  @Output() confirmed = new EventEmitter<boolean>();

  confirm() {
    this.confirmed.emit(true);
  }

  cancel() {
    this.confirmed.emit(false);
  }
}
