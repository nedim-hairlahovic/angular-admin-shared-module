import { Validators } from "@angular/forms";

import { ValidatorConfig } from "../models/data-form";

export const Required: ValidatorConfig = {
  key: "required",
  validator: Validators.required,
  message: "Ovo polje je obavezno.",
};

export const RequiredSelect: ValidatorConfig = {
  key: "required",
  validator: Validators.required,
  message: "Potrebno je odabrati vrijednost.",
};

export const Min = (min: number): ValidatorConfig => ({
  key: "min",
  validator: Validators.min(min),
  message: `Vrijednost mora biti veća ili jednaka ${min}.`,
});

export const Max = (max: number): ValidatorConfig => ({
  key: "max",
  validator: Validators.max(max),
  message: `Vrijednost mora biti manja ili jednaka ${max}.`,
});
