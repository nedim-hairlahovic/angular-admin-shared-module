import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Subject, debounceTime, distinctUntilChanged, map } from "rxjs";

import { SearchableSelectItem } from "../../models/searchable-select-item";
import { ApiResource } from "../../models/api-resource";
import { DataCrudService } from "../../services/data.service";
import { AdminErrorHandlerService } from "../../services/admin-error-handler.service";

@Component({
  selector: "admin-searchable-select",
  templateUrl: "./admin-searchable-select.component.html",
  styleUrls: ["./admin-searchable-select.component.css"],
  standalone: false,
})
export class AdminSearchableSelectComponent<T extends ApiResource>
  implements OnChanges
{
  @Input() inputName!: string;
  @Input() dataService!: DataCrudService<T, any>;
  @Input() initialValue: any;
  @Input() resetTrigger: boolean = false;
  @Input() invalid = false;
  @Output() onSelectEvent = new EventEmitter<any>();

  @ViewChild("searchInput") searchInput!: ElementRef<HTMLInputElement>;

  isValueSelected: boolean = false;
  isDropdownOpen: boolean = false;
  searching: boolean = false;

  private searchTerms = new Subject<string>();
  searchResults: SearchableSelectItem[] = [];
  selectedValue!: SearchableSelectItem | null;

  focusedIndex: number = -1;
  private dropdownSession = 0;

  protected readonly errorHandler = inject(AdminErrorHandlerService);

  constructor() {
    this.searchTerms
      .pipe(
        debounceTime(1000),
        map((term) => ({ term, session: this.dropdownSession })),
        distinctUntilChanged(
          (a, b) => a.term === b.term && a.session === b.session
        ),
        map((x) => x.term)
      )
      .subscribe((term) => this.executeSearch(term));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetValues();

    if (this.initialValue) {
      this.dataService.getSingleItem(this.initialValue).subscribe({
        next: (item: T) => {
          this.onItemSelect(this.dataService.convertToSearchableItem(item));
        },
        error: (err) => this.errorHandler.handleLoadError(),
      });
    }

    // When parent sets resetTrigger to true, clear the select
    if (changes["resetTrigger"] && changes["resetTrigger"].currentValue) {
      this.clearSelectedValue();
    }
  }

  openDropdown(): void {
    this.dropdownSession++;
    this.isDropdownOpen = true;
  }

  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.focusedIndex = -1;
    this.searchResults = [];
    this.searching = true;
    this.searchTerms.next(searchValue);
  }

  executeSearch(query: string): void {
    if (query && query.length >= 3) {
      this.dataService.getAllItems(query).subscribe({
        next: (data: any[]) => {
          this.searchResults = data.map((item) =>
            this.dataService.convertToSearchableItem(item)
          );
          this.searching = false;
        },
        error: (err) => {
          this.searching = false;
        },
      });
    } else {
      this.searchResults = [];
      this.searching = false;
    }
  }

  onItemSelect(item: SearchableSelectItem) {
    this.selectedValue = item;
    this.isValueSelected = true;
    this.isDropdownOpen = false;
    this.onSelectEvent.emit({ inputName: this.inputName, value: item.value });
  }

  onClear(): void {
    this.clearSelectedValue();
    this.dropdownSession++;
    this.isValueSelected = false;

    setTimeout(() => {
      this.searchInput.nativeElement.focus();
      this.searchInput.nativeElement.selectionStart =
        this.searchInput.nativeElement.value.length;
      this.isDropdownOpen = true;
    });
  }

  clearSelectedValue(): void {
    this.resetValues();
    this.onSelectEvent.emit({ inputName: this.inputName, value: null });
  }

  closeDropdown() {
    if (this.isDropdownOpen) {
      // User closed the dropdown without making a selection –
      // emit `null` to reset the value and activate required-field validation.
      this.onSelectEvent.emit({ inputName: this.inputName, value: null });
    }
    this.isDropdownOpen = false;
    if (!this.isValueSelected) {
      this.resetValues();
    }
  }

  resetValues() {
    this.selectedValue = null;
    this.searchResults = [];
    this.isValueSelected = false;
  }

  onKeyDown(event: KeyboardEvent): void {
    const resultsCount = this.searchResults.length;
    if (!resultsCount) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % resultsCount;
        this.scrollToFocused();
        break;

      case "ArrowUp":
        event.preventDefault();

        if (this.focusedIndex < 1) break;

        this.focusedIndex =
          (this.focusedIndex - 1 + resultsCount) % resultsCount;
        this.scrollToFocused();
        break;

      case "Enter":
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < resultsCount) {
          const selected = this.searchResults[this.focusedIndex];
          this.onItemSelect(selected);
        }
        break;

      case "Escape":
        this.isDropdownOpen = false;
        this.focusedIndex = -1;
        break;
    }
  }

  scrollToFocused(): void {
    setTimeout(() => {
      const list = document.querySelectorAll(
        ".dropdown-menu .dropdown-item.clickable"
      );
      if (list[this.focusedIndex]) {
        (list[this.focusedIndex] as HTMLElement).scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    });
  }

  onMouseEnter(i: number): void {
    this.focusedIndex = i;
  }
}
