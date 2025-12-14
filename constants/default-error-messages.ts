import { ErrorMessageMap } from "../config/error-message.token";

export const DEFAULT_FIELD_MESSAGE_MAP: ErrorMessageMap = {
  REQUIRED_NOT_NULL: () => "Ovo polje je obavezno.",
  REQUIRED_NOT_BLANK: () => "Ovo polje je obavezno.",
  NOT_UNIQUE: () => "Vrijednost već postoji u sistemu i mora biti jedinstvena.",
  INVALID_ENUM_VALUE: () => "Odabrana vrijednost nije validna.",
  POSITIVE: () => "Vrijednost mora biti veća od nule.",
  MIN: (p: any) => `Vrijednost mora biti najmanje ${p.min}.`,
  MAX: (p: any) => `Vrijednost ne smije biti veća od ${p.max}.`,
  RANGE: (p: any) => `Vrijednost mora biti u rasponu ${p.min}–${p.max}.`,
};
