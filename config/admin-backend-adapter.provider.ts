import { Provider } from "@angular/core";

import {
  ADMIN_BACKEND_ADAPTER,
  ADMIN_SHARED_CONFIG,
  SpringBackendAdapter,
  LaravelBackendAdapter,
} from "../config";

export const ADMIN_BACKEND_ADAPTER_PROVIDER: Provider = {
  provide: ADMIN_BACKEND_ADAPTER,
  useFactory: (cfg: any) => {
    switch (cfg.backend.type) {
      case "spring":
        return new SpringBackendAdapter();
      case "laravel":
        return new LaravelBackendAdapter();
      default:
        throw new Error(`Unsupported backendType: ${cfg.backendType}`);
    }
  },
  deps: [ADMIN_SHARED_CONFIG],
};
