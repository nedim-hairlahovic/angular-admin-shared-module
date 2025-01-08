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
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
} from '@angular/forms';
import { debounceTime, fromEvent, merge, Observable } from 'rxjs';

import {
  DataFormConfig,
  DataFormElementType,
} from '../../models/data-form';
import { GenericValidator } from '../../validators/generic-validator';
import { ApiResource } from '../../models/api-resource';

@Component({
  selector: 'admin-data-form',
  templateUrl: './admin-data-form.component.html',
  styleUrls: ['../../admin-shared.css']
})
export class AdminDataFormComponent<T extends ApiResource> implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  @Input() config!: DataFormConfig<T>;
  @Input() errorMessage!: string;
  @Input() formProcessing!: boolean;

  @Output() btnSaveEvent = new EventEmitter<any>();
  @Output() btnBackEvent = new EventEmitter<any>();

  mode: 'ADD' | 'EDIT' = 'ADD';
  dataForm!: FormGroup;
  displayMessage: { [key: string]: string } = {};

  readonly TEXT: DataFormElementType = DataFormElementType.Text;
  readonly DATE: DataFormElementType = DataFormElementType.Date;
  readonly NUMBER: DataFormElementType = DataFormElementType.Number;
  readonly SELECT: DataFormElementType = DataFormElementType.Select;
  readonly SEARCHABLE_SELECT: DataFormElementType = DataFormElementType.SearchableSelect;
  readonly TEXTAREA: DataFormElementType = DataFormElementType.TextArea;

  private genericValidator!: GenericValidator;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.config.data && this.config.data.id !== null && this.config.data.id !== 0) {
      this.mode = 'EDIT';
    }

    this.genericValidator = new GenericValidator(
      this.config.validationMessages
    );
    this.initDataForm();
    this.updateDataForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['config']?.firstChange) {
      this.updateDataForm();
    }
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.dataForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(this.dataForm);
      });
  }

  initDataForm(): void {
    this.dataForm = this.fb.group({});
    for (const element of this.config.elements) {
      if (!element.array) {
        const formControl = new FormControl('', element.validators);
        this.dataForm.addControl(element.name, formControl);
      } else {
        this.dataForm.addControl(element.name, this.fb.array([]));
      }
    }
  }

  updateDataForm(): void {
    // If the mode is 'EDIT', populate the form with existing data
    if (this.mode === 'EDIT') {
      let values = {} as any;

      for (const element of this.config.elements) {
        if (!element.array) {
          values[element.name] = this.config.data[element.name];
        } else {
          const formArray = this.fb.array([]);
          for (const singleData of this.config.data[element.name]) {
            formArray.push(new FormControl(singleData, element.validators));
          }

          this.dataForm.setControl(element.name, formArray);
        }
      }

      this.dataForm.patchValue(values);
    } else if (this.mode === 'ADD') {
      // If the mode is 'ADD', initialize the form with default values if exists
      let values = {} as any;

      for (const element of this.config.elements) {
        if (!element.array && element.defaultValue) {
          values[element.name] = element.defaultValue;
        }
      }

      this.dataForm.patchValue(values);
    }
  }

  getFormInputValue(controlName: string): any {
    return this.dataForm.get(controlName)?.value;
  }

  getFormArray(controlName: string): FormArray {
    return this.dataForm.get(controlName) as FormArray;
  }

  addInputToFormArray(controlName: string): void {
    const formArray = this.getFormArray(controlName);
    const config = this.config.elements.find((e: any) => e.name === controlName);
    if (config) {
      formArray.push(new FormControl('', config.validators));
    }
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

  onBack(): void {
    this.btnBackEvent.emit(true);
  }

  onSearchableSelectChange(inputName: string, event: any) {
    var formElement = this.dataForm.get(inputName);
    if (!formElement) {
      return;
    }

    if (Array.isArray(formElement.value)) {
      // If the form element is an array, you can push the new value to the array
      const updatedValue = [...formElement.value, event.value]
        .filter((x) => x !== '')
        .map(x => +x)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
      formElement.setValue(updatedValue);
    } else {
      // If the form element is not an array, set the value directly
      formElement.setValue(event.value);
    }

    formElement.markAsTouched();
    formElement.markAsDirty();
    formElement.updateValueAndValidity();
  }
}
