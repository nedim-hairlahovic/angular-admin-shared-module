import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { SearchableSelectItem } from '../../models/searchable-select-item';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';

@Component({
  selector: 'admin-searchable-select',
  templateUrl: './admin-searchable-select.component.html',
  styleUrls: ['./admin-searchable-select.component.css']
})
export class AdminSearchableSelectComponent<T extends ApiResource> implements OnChanges {
  @Input() inputName!: string;
  @Input() dataService!: DataCrudService<T>;
  @Input() initialValue: any;
  @Output() onSelectEvent = new EventEmitter<any>();

  isValueSelected: boolean = false;
  isDropdownOpen: boolean = false;
  searching: boolean = false;

  private searchTerms = new Subject<string>();
  searchResults: SearchableSelectItem[] = [];
  selectedValue!: SearchableSelectItem | null;

  constructor() {
    this.searchTerms.pipe(
      debounceTime(1000), // 1000 ms delay
      distinctUntilChanged()
    ).subscribe(term => this.executeSearch(term));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetValues();

    if (this.initialValue) {
      this.dataService.getSingleItem(this.initialValue).subscribe({
        next: (item: T) => {
          this.onItemSelect(this.dataService.convertToSearchableItem(item));
        },
        error: err => console.log(err)
      });
    }
  }

  onSearch(term: string): void {
    this.searchResults = [];
    this.searching = true;
    this.searchTerms.next(term);
  }

  executeSearch(query: string): void {
    if (query && query.length >= 3) {
      this.dataService.getAllItems(query).subscribe({
        next: (data: any[]) => {
          this.searchResults = data.map(item => this.dataService.convertToSearchableItem(item));
          this.searching = false
        },
        error: err => {
          console.log(err)
          this.searching = false
        }
      });
    } else {
      this.searchResults = [];
      this.searching = false
    }
  }

  onItemSelect(item: SearchableSelectItem) {
    this.selectedValue = item;
    this.isValueSelected = true;
    this.isDropdownOpen = false;
    this.onSelectEvent.emit({ inputName: this.inputName, value: item.value })
  }

  clearSelectedValue(): void {
    this.resetValues();
    this.onSelectEvent.emit({ inputName: this.inputName, value: null })
  }

  clearInput() {
    if (!this.isValueSelected) {
      this.resetValues();
    }
  }

  resetValues() {
    this.selectedValue = null;
    this.searchResults = [];
    this.isValueSelected = false;
  }
}
