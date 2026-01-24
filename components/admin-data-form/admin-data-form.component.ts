import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { debounceTime, fromEvent, merge, Observable } from "rxjs";

import {
  DataFormConfig,
  DataFormControlMode,
  DataFormElementType,
  ValidatorConfig,
} from "../../models/data-form";
import { ApiResource } from "../../models/api-resource";
import { AdminSearchableSelectComponent } from "../admin-searchable-select/admin-searchable-select.component";

@Component({
  selector: "admin-data-form",
  templateUrl: "./admin-data-form.component.html",
  styleUrls: ["../../admin-shared.css", "./admin-data-form.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, AdminSearchableSelectComponent],
})
export class AdminDataFormComponent<
  TEntity extends ApiResource,
  TRequest,
  TForm,
>
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  @Input() config!: DataFormConfig<TEntity, TForm>;
  @Input() backendFieldErrors: Record<string, string> | null = null;
  @Input() formProcessing!: boolean;
  @Output() btnSaveEvent = new EventEmitter<TRequest>();

  mode!: "ADD" | "EDIT";
  dataForm!: FormGroup;
  validationMessages: Partial<Record<keyof TForm, Record<string, string>>> = {};
  displayMessages: { [key: string]: string } = {};

  readonly TEXT: DataFormElementType = DataFormElementType.Text;
  readonly DATE: DataFormElementType = DataFormElementType.Date;
  readonly NUMBER: DataFormElementType = DataFormElementType.Number;
  readonly SELECT: DataFormElementType = DataFormElementType.Select;
  readonly SEARCHABLE_SELECT: DataFormElementType =
    DataFormElementType.SearchableSelect;
  readonly TEXTAREA: DataFormElementType = DataFormElementType.TextArea;
  readonly TIME: DataFormElementType = DataFormElementType.Time;
  readonly CHECKBOX: DataFormElementType = DataFormElementType.Checkbox;

  DataFormControlMode = DataFormControlMode;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.mode = this.config.isEditMode ? "EDIT" : "ADD";

    this.initDataForm();
    this.updateDataForm();
  }

  private previousConfigData: any;

  ngOnChanges(changes: SimpleChanges): void {
    // Only update the form if the actual config.data reference has changed
    // (avoid unnecessary form resets caused by unrelated Input changes like formProcessing)
    if (changes["config"] && !changes["config"].firstChange) {
      const currentData = this.config?.data;
      const previousData = this.previousConfigData;

      if (currentData !== previousData) {
        this.updateDataForm();
        this.previousConfigData = currentData;
      }
    }

    if (changes["backendFieldErrors"] && this.backendFieldErrors) {
      this.applyBackendFieldErrors();
    }
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, "blur"),
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.dataForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.displayMessages = this.processValidationMessages(
          this.dataForm,
          this.validationMessages,
        );
      });
  }

  initDataForm(): void {
    const formControls: any = {};

    const validationMessages: Partial<
      Record<keyof TForm, Record<string, string>>
    > = {};

    for (const el of this.config.elements) {
      const mode = el.mode ?? DataFormControlMode.Control;

      if (mode === DataFormControlMode.Control) {
        const validators = el.validators?.map((v) => v.validator) ?? [];

        formControls[el.name] = new FormControl(
          { value: "", disabled: !!el.disabled },
          validators,
        );
      } else if (mode === DataFormControlMode.Array) {
        const validators = el.validators?.map((v) => v.validator) ?? [];

        formControls[el.name] = this.fb.array([
          new FormControl("", validators),
        ]);
      }

      // Collect validation messages per form control, keyed by validator name
      // (used later to map validation errors to user-friendly messages)
      if (el.validators && el.validators.length) {
        if (!el.validators?.length) continue;

        validationMessages[el.name] = el.validators.reduce(
          (acc, v) => {
            acc[v.key] = v.message;
            return acc;
          },
          {} as { [k: string]: string },
        );
      }
    }

    this.validationMessages = validationMessages;
    this.dataForm = this.fb.group(formControls);
  }

  updateDataForm(): void {
    // If the mode is 'EDIT', populate the form with existing data
    if (this.mode === "EDIT") {
      const data = this.config.data;
      if (!data) return;

      const values: Partial<TForm> = {};

      for (const element of this.config.elements) {
        const mode = element.mode ?? DataFormControlMode.Control;

        if (mode === DataFormControlMode.Control) {
          values[element.name] = data[element.name];
          continue;
        }

        if (mode === DataFormControlMode.Array) {
          const raw = data[element.name];
          const items = Array.isArray(raw) ? raw : [];

          const formArray = this.fb.array(
            items.map(
              (singleData) =>
                new FormControl(
                  singleData,
                  element.validators?.map(
                    (v: ValidatorConfig) => v.validator,
                  ) ?? [],
                ),
            ),
          );

          this.dataForm.setControl(element.name, formArray);
        }
      }

      this.dataForm.patchValue(values);
    } else if (this.mode === "ADD") {
      let values = {} as any;

      for (const el of this.config.elements) {
        // Use default value if specified in the element definition
        if (el.defaultValue) {
          values[el.name] = el.defaultValue;
        }

        // Override with provided data value if available
        if (this.config.data && this.config.data[el.name]) {
          values[el.name] = this.config.data[el.name];
        }
      }

      this.dataForm.patchValue(values);
      this.patchFormArrayValues(values);
    }
  }

  private applyBackendFieldErrors(): void {
    Object.entries(this.backendFieldErrors!).forEach(([fieldName, message]) => {
      const arrayFieldMatch =
        fieldName.match(/^(.+?)\[(\d+)\]$/) || // fieldName[0]
        fieldName.match(/^(.+?)(\d+)$/); // fieldName0 (fallback)

      if (arrayFieldMatch) {
        // TODO: Map backend array field names (request → form) using config.requestFieldMap
        // (same mapping logic as resolveBackendFieldToFormField)
        const [, arrayName, indexStr] = arrayFieldMatch;
        const index = Number(indexStr);
        const array = this.dataForm.get(arrayName) as FormArray | null;

        const control = array?.at(index);
        if (!control) return;

        control.setErrors({ ...(control.errors ?? {}), backend: message });
        control.markAsTouched();
        return;
      } else {
        const formField = this.resolveBackendFieldToFormField(fieldName);

        const control = this.dataForm.get(formField);
        if (!control) return;

        const existing = control.errors ?? {};
        control.setErrors({
          ...existing,
          backend: message,
        });
        control.markAsTouched();
      }
    });

    this.displayMessages = this.processValidationMessages(
      this.dataForm,
      this.validationMessages,
    );
  }

  private resolveBackendFieldToFormField(field: string): string {
    const map = this.config.requestFieldMap;
    if (!map) return field;

    // invert: requestField -> formField
    const entry = Object.entries(map).find(([, req]) => req === field);
    return entry ? entry[0] : field;
  }

  getFormInputValue(controlName: string): any {
    return this.dataForm.get(controlName)?.value;
  }

  getFormArray(controlName: string): FormArray {
    return this.dataForm.get(controlName) as FormArray;
  }

  addInputToFormArray(controlName: string): void {
    const formArray = this.getFormArray(controlName);
    const config = this.config.elements.find(
      (e: any) => e.name === controlName,
    );

    if (!config) {
      return;
    }

    const validators =
      config.validators?.map((v: ValidatorConfig) => v.validator) ?? [];

    formArray.push(new FormControl(config.defaultValue ?? null, validators));
    formArray.markAsDirty();
  }

  deleteInputFromFormArray(controlName: string, index: number): void {
    const formArray = this.getFormArray(controlName);
    formArray.removeAt(index);
    formArray.markAsDirty();
  }

  onSave(): void {
    if (this.dataForm.valid) {
      const formValues = { ...this.dataForm.value };
      const formData = { ...this.config.data, ...formValues };
      this.btnSaveEvent.emit(formData);
    }
  }

  onSearchableSelectChange(controlName: string, event: any) {
    const control = this.dataForm.get(controlName);

    if (!control) {
      return;
    }

    control.setValue(event?.value ?? null);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity({ emitEvent: true });
  }

  onSearchableSelectChangeInArray(
    controlArrayName: string,
    index: number,
    event: any,
  ) {
    const array = this.dataForm.get(controlArrayName) as FormArray | null;
    const control = array?.at(index);
    if (!control) return;

    control.setValue(event.value);
    control.markAsTouched();
    control.markAsDirty();
    control.updateValueAndValidity();
  }

  patchFormArrayValues(values: any): void {
    for (const el of this.config.elements) {
      const mode = el.mode ?? DataFormControlMode.Control;

      if (mode === DataFormControlMode.Array) {
        const controlName = String(el.name);
        const formArray = this.dataForm.get(controlName) as FormArray;
        const arrayValue = values[controlName] ?? [];

        if (formArray && formArray instanceof FormArray) {
          formArray.clear();

          for (const item of arrayValue) {
            const validators =
              el.validators?.map((v: ValidatorConfig) => v.validator) ?? [];
            formArray.push(new FormControl(item, validators));
          }
        }
      }
    }
  }

  processValidationMessages(
    form: FormGroup,
    validationMessages: Partial<
      Record<Extract<keyof TForm, string>, Record<string, string>>
    >,
  ): Record<string, string> {
    const messages: Record<string, string> = {};

    for (const controlKey in form.controls) {
      if (!Object.prototype.hasOwnProperty.call(form.controls, controlKey))
        continue;

      const c = form.controls[controlKey];
      const key = controlKey as Extract<keyof TForm, string>; // ✅

      if (c instanceof FormGroup) {
        Object.assign(
          messages,
          this.processValidationMessages(c, validationMessages),
        );
        continue;
      }

      if (c instanceof FormArray) {
        for (let i = 0; i < c.controls.length; i++) {
          const singleControl = c.controls[i];
          messages[controlKey + i] = "";

          if (
            (singleControl.dirty || singleControl.touched) &&
            singleControl.errors
          ) {
            Object.entries(singleControl.errors).forEach(
              ([errorKey, errorValue]) => {
                if (errorKey === "backend" && typeof errorValue === "string") {
                  messages[controlKey + i] += errorValue;
                } else if (validationMessages[key]?.[errorKey]) {
                  messages[controlKey + i] +=
                    validationMessages[key]![errorKey];
                }
              },
            );
          }
        }
        continue;
      }

      messages[controlKey] = "";

      if ((c.dirty || c.touched) && c.errors) {
        Object.entries(c.errors).forEach(([errorKey, errorValue]) => {
          if (errorKey === "backend" && typeof errorValue === "string") {
            messages[controlKey] += errorValue + " ";
          } else if (validationMessages[key]?.[errorKey]) {
            messages[controlKey] += validationMessages[key]![errorKey] + " ";
          }
        });
      }
    }

    return messages;
  }
}
