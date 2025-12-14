import { InjectionToken } from "@angular/core";

export type ErrorMessageFactory = (params?: Record<string, any>) => string;
export type ErrorMessageMap = Record<string, ErrorMessageFactory>;

export const ERROR_MESSAGE_MAP = new InjectionToken<ErrorMessageMap>(
  "ERROR_MESSAGE_MAP",
  { factory: () => ({}) } // default empty map
);
