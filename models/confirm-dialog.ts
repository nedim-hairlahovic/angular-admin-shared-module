export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "success" | "danger" | "warning" | "info";
}
