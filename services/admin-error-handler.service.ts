import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AdminToastService } from "./admin-toast.service";
import { AdminErrorMessageService } from "./admin-error-message.service";

@Injectable({ providedIn: "root" })
export class AdminErrorHandlerService {
  constructor(
    private readonly toast: AdminToastService,
    private readonly errorMessageService: AdminErrorMessageService,
  ) {}

  handleLoadError(): void {
    this.toast.error(
      "Došlo je do greške prilikom učitavanja podataka. Molimo pokušajte ponovo.",
    );
  }

  handleOperationError(
    error: unknown,
    fallbackMessage: string = "Došlo je do greške prilikom izvršavanja operacije.",
  ): void {
    const message = this.extractMessage(error) ?? fallbackMessage;
    this.toast.error(message);
  }

  private extractMessage(error: unknown): string | null {
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === "object") {
        const backendError = error.error as any;
        const localized =
          this.errorMessageService.backendErrorToUserMessage(backendError);
        if (localized) return localized;
      }
      if (typeof error.error === "string") {
        return error.error;
      }
      if (error.message) {
        return error.message;
      }
    }

    if (typeof error === "string") return error;

    if (error && typeof error === "object" && "message" in error) {
      return (error as any).message;
    }

    return null;
  }
}
