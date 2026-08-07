import {
  ComponentRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from "@angular/core";
import { Subscription } from "rxjs";

import { DataFormCustomFieldComponent } from "../models/data-form";

// Dynamically mounts whatever component a DataFormElementType.Custom field
// points at, and bridges its initialValue/valueChange to plain @Input/@Output
// bindings on the host element - so admin-data-form never needs to know
// about the concrete component.
@Directive({
  selector: "[customFieldHost]",
  standalone: true,
})
export class CustomFieldHostDirective<T = any> implements OnChanges, OnDestroy {
  @Input("customFieldHost") component!: Type<DataFormCustomFieldComponent<T>>;
  @Input() initialValue: T | null = null;
  @Output() valueChange = new EventEmitter<T>();

  private componentRef?: ComponentRef<DataFormCustomFieldComponent<T>>;
  private valueChangeSub?: Subscription;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["component"] && this.component) {
      this.createComponent();
    } else if (this.componentRef && changes["initialValue"]) {
      this.componentRef.setInput("initialValue", this.initialValue);
    }
  }

  ngOnDestroy(): void {
    this.valueChangeSub?.unsubscribe();
  }

  private createComponent(): void {
    this.valueChangeSub?.unsubscribe();
    this.viewContainerRef.clear();

    this.componentRef = this.viewContainerRef.createComponent(this.component);
    this.componentRef.setInput("initialValue", this.initialValue);
    this.valueChangeSub = this.componentRef.instance.valueChange.subscribe(
      (value: T) => this.valueChange.emit(value),
    );
  }
}
