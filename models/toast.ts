export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  title?: string;
  type?: ToastType;
  duration?: number; // ms
  leaving?: boolean;
}
