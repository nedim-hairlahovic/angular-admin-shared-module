import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { ConfirmDialogOptions } from "../models/confirm-dialog";

interface ConfirmRequest {
  options: ConfirmDialogOptions;
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: "root",
})
export class AdminConfirmDialogService {
  private requests$ = new Subject<ConfirmRequest>();

  get requests() {
    return this.requests$.asObservable();
  }

  confirm(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.requests$.next({ options, resolve });
    });
  }
}
