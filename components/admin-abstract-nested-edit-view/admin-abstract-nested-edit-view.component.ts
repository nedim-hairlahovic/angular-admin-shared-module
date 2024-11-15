import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataFormConfig, DataFormSelectOption } from '../../models/data-form';
import { ApiResource } from '../../models/api-resource';
import { NestedDataService } from '../../services/nested-data.service';

@Component({
  template: ''
})
export abstract class AdminAbstractNestedEditViewComponent<T extends ApiResource> implements OnInit {
  pageTitle: string = this.getTitle(null);
  formConfig!: DataFormConfig<T>;
  errorMessage!: string;
  parentId!: string | null;
  childId!: string | null;

  constructor(private dataService: NestedDataService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(item: T | null): string;
  abstract getChildIdKey(): string;
  abstract getAndUpdateRelatedFormData(): void;
  abstract convertToRequestObject(item: T): any;

  ngOnInit(): void {
    this.pageTitle = this.getTitle(null);
    this.route.paramMap.subscribe(params => {
      this.parentId = params.get(this.getParentIdKey());
      this.childId = params.get(this.getChildIdKey());
      this.getItem();
    });
  }

  getParentIdKey(): string {
    return 'id';
  }

  getItem(): void {
    this.dataService.getSingleItem(this.parentId, this.childId).subscribe({
      next: (item: T) => this.updateFormData(item),
      error: err => console.log(err)
    })
    this.getAndUpdateRelatedFormData();
  }

  updateFormData(item: T): void {
    this.pageTitle = this.getTitle(item);

    if (this.formConfig) {
      this.formConfig.title = this.pageTitle;
      this.formConfig = { ...this.formConfig, data: this.convertToRequestObject(item) };
    }
  }

  updateSelectValues(selectValues: any[], controlName: string,
    value: string = 'value',
    label: string = 'label') {
    const selectOptions = [] as DataFormSelectOption[];
    for (const selectValue of selectValues) {
      selectOptions.push({
        value: selectValue[value],
        label: selectValue[label],
      } as DataFormSelectOption);
    }

    const targetSelectInput = this.formConfig?.elements.find((x: any) => x.id === controlName);
    if (targetSelectInput) {
      targetSelectInput.values = selectOptions;
    }
  }

  onSave(item: T): void {
    if (!this.isEditMode(item)) {
      this.dataService.createItem(this.parentId, item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    } else {
      this.dataService.updateItem(this.parentId, this.childId, item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    }
  }

  isEditMode(item: T): boolean {
    return this.childId !== '0';
  }

  onSaveComplete(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

  onBack(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

}
