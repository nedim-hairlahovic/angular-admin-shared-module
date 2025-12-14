import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { Toast, ToastType } from "../models/toast";

@Injectable({ providedIn: "root" })
export class AdminToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  private idCounter = 0;

  show(
    message: string,
    options?: { title?: string; type?: ToastType; duration?: number }
  ) {
    const toast: Toast = {
      id: ++this.idCounter,
      message,
      title: options?.title,
      type: options?.type ?? "info",
      duration: options?.duration ?? 4000,
    };

    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    // Automatically dismiss the toast after the configured duration (if provided)
    if (toast.duration && toast.duration > 0)
      setTimeout(() => this.dismiss(toast.id), toast.duration);
  }

  success(message: string, title = "Uspješna akcija", duration = 3000) {
    this.show(message, { title, type: "success", duration });
  }

  error(message: string, title = "Greška", duration = 4000) {
    this.show(message, { title, type: "error", duration });
  }

  info(message: string, title = "Informacija", duration = 3000) {
    this.show(message, { title, type: "info", duration });
  }

  warning(message: string, title = "Upozorenje", duration = 3000) {
    this.show(message, { title, type: "warning", duration });
  }

  dismiss(id: number) {
    const current = this.toastsSubject.getValue();
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) return;

    // mark as leaving to trigger CSS transition
    const toast = { ...current[index], leaving: true };
    const updated = [...current];
    updated[index] = toast;
    this.toastsSubject.next(updated);

    // wait for CSS transition to finish, then remove
    setTimeout(() => {
      const after = this.toastsSubject.getValue();
      this.toastsSubject.next(after.filter((t) => t.id !== id));
    }, 200); // must match CSS transition duration
  }

  clearAll() {
    this.toastsSubject.next([]);
  }
}
