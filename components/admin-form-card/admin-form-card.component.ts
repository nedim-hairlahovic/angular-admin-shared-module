import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AdminDataFormComponent } from '../admin-data-form/admin-data-form.component';
import { DataFormConfig } from '../../models/data-form';

@Component({
  selector: 'admin-form-card',
  templateUrl: './admin-form-card.component.html',
  standalone: true,
  imports: [AdminDataFormComponent],
})
export class AdminFormCardComponent {
  @Input() config!: DataFormConfig<any, any>;
  @Input() backendFieldErrors: Record<string, string> | null = null;
  @Input() formProcessing: boolean = false;
  @Output() btnSaveEvent = new EventEmitter<any>();

  formValid = false;
}
