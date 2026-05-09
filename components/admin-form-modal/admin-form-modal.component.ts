import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdminDataFormComponent } from '../admin-data-form/admin-data-form.component';
import { AdminModalComponent } from '../admin-modal/admin-modal.component';
import { DataFormConfig } from '../../models/data-form';

export interface FormModalAction {
  name: string;
  label: string;
  variant: 'danger' | 'secondary' | 'warning';
  disabled?: boolean;
}

@Component({
  selector: 'admin-form-modal',
  templateUrl: './admin-form-modal.component.html',
  styleUrls: ['./admin-form-modal.component.scss'],
  standalone: true,
  imports: [AdminModalComponent, AdminDataFormComponent],
})
export class AdminFormModalComponent {
  private static nextId = 0;

  @Input() config!: DataFormConfig<any, any>;
  @Input() backendFieldErrors: Record<string, string> | null = null;
  @Input() formProcessing: boolean = false;
  @Input() show: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() actions: FormModalAction[] = [];
  @Input() saveLabel: string = 'Spremi';
  @Input() cancelLabel: string = 'Odustani';
  @Output() btnSaveEvent = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  readonly formId = `admin-form-modal-${++AdminFormModalComponent.nextId}`;
  formValid = false;
}
