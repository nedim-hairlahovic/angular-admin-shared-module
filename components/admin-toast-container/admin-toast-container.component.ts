import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Observable } from "rxjs";

import { Toast } from "../../models/toast";
import { AdminToastService } from "../../services/admin-toast.service";

@Component({
  selector: "admin-toast-container",
  templateUrl: "./admin-toast-container.component.html",
  styleUrls: [
    "../../admin-shared.css",
    "./admin-toast-container.component.css",
  ],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminToastContainerComponent {
  toastService = inject(AdminToastService);

  readonly toasts$: Observable<Toast[]> = this.toastService.toasts$;

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }

  onCloseClick(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.dismiss(id);
  }

  getIconClass(type?: string): string {
    switch (type) {
      case "success":
        return "fa fa-check-circle";
      case "error":
        return "fa fa-exclamation-circle";
      case "warning":
        return "fa fa-exclamation-triangle";
      default:
        return "fa fa-info-circle";
    }
  }
}
