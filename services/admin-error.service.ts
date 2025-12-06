import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AdminToastService } from "./admin-toast.service";

@Injectable({ providedIn: "root" })
export class AdminErrorService {
  constructor(private readonly toast: AdminToastService) {}

  handleHttpError(
    error: unknown,
    fallbackMessage: string = "Došlo je do greške prilikom izvršavanja operacije."
  ): void {
    const message = this.extractMessage(error) ?? fallbackMessage;
    this.toast.error(message);
  }

  private extractMessage(error: unknown): string | null {
    if (error instanceof HttpErrorResponse) {
      if (
        error.error &&
        typeof error.error === "object" &&
        "message" in error.error
      ) {
        return (error.error as any).message;
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
