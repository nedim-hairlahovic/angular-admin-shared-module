import { InjectionToken } from "@angular/core";

export type BackendType = "spring" | "laravel";
export type ThemeName = "sb-admin2";

export interface AdminSharedConfig {
  backend: {
    url: string;
    apiBasePath: string;
    type: BackendType;
  };

  theme: {
    name: ThemeName;
  };

  // future config options can go here
}

export const ADMIN_SHARED_CONFIG = new InjectionToken<AdminSharedConfig>(
  "ADMIN_SHARED_CONFIG",
);
