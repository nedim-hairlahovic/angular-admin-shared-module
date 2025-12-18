import { Component } from "@angular/core";
import { Subscription } from "rxjs";

import { ConfirmDialogOptions } from "../../models/confirm-dialog";
import { AdminConfirmDialogService } from "../../services/admin-confirm-dialog.service";

@Component({
  selector: "admin-confirm-dialog-host",
  templateUrl: "./admin-confirm-dialog-host.component.html",
  styleUrls: ["../../admin-shared.css"],
  standalone: false,
})
export class AdminConfirmDialogHostComponent {
  current?: {
    options: ConfirmDialogOptions;
    resolve: (v: boolean) => void;
  };

  private sub!: Subscription;

  constructor(private confirmService: AdminConfirmDialogService) {}

  ngOnInit() {
    this.sub = this.confirmService.requests.subscribe((req) => {
      this.current = req;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onResult(result: boolean) {
    this.current?.resolve(result);
    this.current = undefined;
  }
}
