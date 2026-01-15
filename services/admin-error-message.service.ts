import { Inject, Injectable } from "@angular/core";

import {
  ERROR_MESSAGE_MAP,
  ErrorMessageMap,
} from "../config/error-message.token";
import { BackendError } from "../config/backend/backend-types";

@Injectable({
  providedIn: "root",
})
export class AdminErrorMessageService {
  constructor(
    @Inject(ERROR_MESSAGE_MAP) private readonly messages: ErrorMessageMap
  ) {}

  backendErrorToUserMessage(error: BackendError): string | null {
    const code = error.code;
    const resolver = code ? this.messages[code] : undefined;

    if (resolver) {
      return resolver(error.params ?? {});
    }

    if (error.message) {
      return error.message;
    }

    return null;
  }
}
