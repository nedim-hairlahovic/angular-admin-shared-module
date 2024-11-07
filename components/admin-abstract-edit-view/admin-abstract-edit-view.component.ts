import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataFormConfig, DataFormSelectOption } from '../../models/data-form';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';

@Component({
  template: ''
})
export abstract class AdminAbstractEditViewComponent<T extends ApiResource> implements OnInit {
  pageTitle: string = this.getTitle(null);
  formConfig!: DataFormConfig<T>;
  errorMessage!: string;
  urlId!: string | null;

  constructor(private dataService: DataCrudService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(item: T | null): string;
  abstract getAndUpdateRelatedFormData(): void;

  ngOnInit(): void {
    this.pageTitle = this.getTitle(null);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.urlId = id;
      this.getItem(id);
    });
  }

  getItem(id: any): void {
    this.dataService.getSingleItem(id).subscribe({
      next: (item: T) => this.updateFormData(item),
      error: err => console.log(err)
    })
    this.getAndUpdateRelatedFormData();
  }

  updateFormData(item: T): void {
    this.pageTitle = this.getTitle(item);
    this.formConfig.title = this.pageTitle;
    this.formConfig = { ...this.formConfig, data: this.convertToRequestObject(item) };
  }

  convertToRequestObject(item: T): any {
    return item;
  }

  updateSelectValues(selectValues: any[], controlName: string) {
    const selectOptions = [] as DataFormSelectOption[];
    for (const selectValue of selectValues) {
      selectOptions.push({
        value: selectValue.value.toString(),
        label: selectValue.label,
      } as DataFormSelectOption);
    }

    const targetSelectInput = this.formConfig.elements.find((x: any) => x.id === controlName);
    if (targetSelectInput) {
      targetSelectInput.values = selectOptions;
    }
  }

  onSave(item: T): void {
    if (!this.isEditMode(item)) {
      this.dataService.createItem(item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    } else {
      this.dataService.updateItem(item.id.toString(), item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    }
  }

  isEditMode(item: T): boolean {
    return this.urlId !== '0';
  }

  onSaveComplete(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

  onBack(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

}
