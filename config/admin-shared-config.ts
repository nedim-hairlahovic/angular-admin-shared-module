import { InjectionToken } from "@angular/core";

export type BackendType = "spring" | "laravel";

export interface AdminSharedConfig {
  backend: {
    url: string;
    apiBasePath: string;
    type: BackendType;
  };

  // future config options can go here
}

export const ADMIN_SHARED_CONFIG = new InjectionToken<AdminSharedConfig>(
  "ADMIN_SHARED_CONFIG"
);
