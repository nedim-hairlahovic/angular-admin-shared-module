export interface ErrorDto {
  message: string;
  code?: string;
  fieldErrors?: Record<string, FieldErrorDto>;
  params?: Record<string, unknown>;
  details?: Array<Record<string, string>>;
}

export interface FieldErrorDto {
  errorCode: string;
  message: string;
  params?: Record<string, any>;
}
