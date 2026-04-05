import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgComponentOutlet } from "@angular/common";

import {
  DetailsViewData,
  DetailsViewImageUploadConfig,
} from "../../models/details-view";
import { CardButton } from "../../models/data-card";
import { AdminToastService } from "../../services/admin-toast.service";
import { AdminConfirmDialogService } from "../../services/admin-confirm-dialog.service";
import { AdminImageUploadComponent } from "../admin-image-upload/admin-image-upload.component";

@Component({
  selector: "admin-details-view",
  templateUrl: "./admin-details-view.component.html",
  styleUrls: ["./admin-details-view.component.scss"],
  standalone: true,
  imports: [RouterLink, NgComponentOutlet, AdminImageUploadComponent],
})
export class AdminDetailsViewComponent {
  @Input() data!: DetailsViewData;
  @Input() buttons: CardButton[] = [];
  @Input() imageUpload?: DetailsViewImageUploadConfig;

  @Output() btnClickEvent = new EventEmitter<any>();

  private readonly toast = inject(AdminToastService);
  private readonly confirmDialog = inject(AdminConfirmDialogService);

  pendingImageFile: File | null = null;
  uploading = false;
  uploadError: string | null = null;

  imageUploadHint(config: DetailsViewImageUploadConfig): string {
    const types = config.accept
      ? config.accept.replace(/image\//g, "").toUpperCase()
      : "JPG, PNG, WebP, SVG";
    const size = config.maxSizeBytes
      ? ` · maks. ${(config.maxSizeBytes / 1024 / 1024).toFixed(0)} MB`
      : "";
    return types + size;
  }

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName);
  }

  onImageChange(file: File | null): void {
    this.pendingImageFile = file;
    this.uploadError = null;
  }

  async onImageDelete(): Promise<void> {
    if (!this.imageUpload?.deleteFn) return;

    const confirmed = await this.confirmDialog.confirm({
      title: "Ukloni sliku",
      message: "Da li ste sigurni da želite ukloniti sliku?",
      confirmText: "Ukloni",
      confirmVariant: "danger",
    });

    if (!confirmed) return;

    this.imageUpload.deleteFn().subscribe({
      next: () => {
        this.imageUpload = { ...this.imageUpload!, currentUrl: null };
        this.pendingImageFile = null;
        this.uploadError = null;
        this.toast.success("Slika je uspješno uklonjena.");
      },
      error: () => {
        this.toast.error("Greška prilikom uklanjanja slike.");
      },
    });
  }

  saveImage(): void {
    if (!this.pendingImageFile || !this.imageUpload) return;

    this.uploading = true;
    this.uploadError = null;

    this.imageUpload.uploadFn(this.pendingImageFile).subscribe({
      next: () => {
        this.uploading = false;
        this.pendingImageFile = null;
        this.toast.success("Slika je uspješno ažurirana.");
      },
      error: () => {
        this.uploading = false;
        this.uploadError = "Greška prilikom uploada. Pokušajte ponovo.";
        this.toast.error("Greška prilikom uploada slike.");
      },
    });
  }
}
