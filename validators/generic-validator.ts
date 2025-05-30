import { FormArray, FormGroup, Validators } from '@angular/forms';

// Generic validator for Reactive forms
// Implemented as a class, not a service, so it can retain state for multiple forms.
// NOTE: This validator does NOT support validation of controls or groups within a FormArray.
export class GenericValidator {

  public static readonly textValidators = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ];

  public static textValidationMessages(field: string) {
    return {
      required: `Polje ${field} je obavezno.`,
      minlength: `Polje ${field} mora sadržavati barem 3 karaktera.`,
      maxlength: `Polje ${field} ne smije sadržavati više od 50 karaktera.`
    }
  };

  public static requiredValidationMessage(field: string) {
    return {
      required: `Polje ${field} je obavezno.`,
    }
  }

  public static requiredSelectValidationMessage(field: string) {
    return {
      required: `Odabir stavke za polje ${field} je obavezno.`,
    }
  }

  // Provide the set of valid validation messages
  // Stucture:
  // controlName1: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // },
  // controlName2: {
  //     validationRuleName1: 'Validation Message.',
  //     validationRuleName2: 'Validation Message.'
  // }
  constructor(private validationMessages: { [key: string]: { [key: string]: string } }) {

  }

  // Processes each control within a FormGroup
  // And returns a set of validation messages to display
  // Structure
  // controlName1: 'Validation Message.',
  // controlName2: 'Validation Message.'
  processMessages(container: FormGroup): { [key: string]: string } {
    const messages = {} as any;
    for (const controlKey in container.controls) {
      if (container.controls.hasOwnProperty(controlKey)) {
        const c = container.controls[controlKey];
        // If it is a FormGroup, process its child controls.
        if (c instanceof FormGroup) {
          const childMessages = this.processMessages(c);
          Object.assign(messages, childMessages);
        } else if (c instanceof FormArray) { // If it is a FormArray, process each control separately.
          const arrayControls = c.controls;
          for (let i = 0; i < arrayControls.length; i++) {
            const singleControl = arrayControls[i];
            // Only validate if there are validation messages for the control
            // console.log('this.validationMessages[controlKey]', this.validationMessages[controlKey])
            if (this.validationMessages[controlKey]) {
              messages[controlKey + i] = '';
              if ((singleControl.dirty || singleControl.touched) && singleControl.errors) {
                Object.keys(singleControl.errors).map(messageKey => {
                  if (this.validationMessages[controlKey][messageKey]) {
                    messages[controlKey + i] += this.validationMessages[controlKey][messageKey] + ' ';
                  }
                });
              }
            }
          }
        } else {
          // Only validate if there are validation messages for the control
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if ((c.dirty || c.touched) && c.errors) {
              Object.keys(c.errors).map(messageKey => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] += this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
            }
          }
        }
      }
    }
    return messages;
  }

  //   getErrorCount(container: FormGroup): number {
  //     let errorCount = 0;
  //     for (const controlKey in container.controls) {
  //       if (container.controls.hasOwnProperty(controlKey)) {
  //         if (container.controls[controlKey].errors) {
  //           errorCount += Object.keys(container?.controls[controlKey]?.errors).length;
  //           console.log(errorCount);
  //         }
  //       }
  //     }
  //     return errorCount;
  //   }


}
