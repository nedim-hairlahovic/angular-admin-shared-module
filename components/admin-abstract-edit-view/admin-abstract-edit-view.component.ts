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
  mode: 'ADD' | 'EDIT' = 'ADD';
  dataLoaded: boolean = false;

  constructor(private dataService: DataCrudService<T>, private route: ActivatedRoute, private router: Router) { }

  abstract getTitle(item: T | null): string;
  abstract getAndUpdateRelatedFormData(): void;

  ngOnInit(): void {
    this.pageTitle = this.getTitle(null);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.urlId = id;
      this.mode = this.urlId === '0' ? 'ADD' : 'EDIT';
      this.getItem(id);

      this.updateDefaultValuesFromQueryParams();
    });
  }

  getItem(id: any): void {
    this.dataLoaded = false;
    this.dataService.getSingleItem(id).subscribe({
      next: (item: T) => this.updateFormData(item),
      error: err => console.log(err)
    })
    this.getAndUpdateRelatedFormData();
  }

  updateDefaultValuesFromQueryParams(): void {
    // Subscribe to query params and update default values in form configuration
    this.route.queryParamMap.subscribe((params) => {
      this.formConfig.elements.forEach((element) => {
        const paramValue = params.get(element.name);
        if (paramValue) {
          element.defaultValue = paramValue;
        }
      });
    });
  }

  updateFormData(item: T): void {
    this.pageTitle = this.getTitle(item);
    this.formConfig.title = this.pageTitle;
    this.formConfig = { ...this.formConfig, data: this.convertToRequestObject(item) };
    this.dataLoaded = true;
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
    if (this.mode === 'ADD') {
      this.dataService.createItem(item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    } else if (this.mode === 'EDIT') {
      this.dataService.updateItem(item.id.toString(), item)
        .subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err.error.message
        })
    }
  }

  onSaveComplete(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

  onBack(): void {
    this.router.navigate([this.formConfig.baseUrl]);
  }

}
