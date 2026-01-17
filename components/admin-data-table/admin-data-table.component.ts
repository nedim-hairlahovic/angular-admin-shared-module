import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  PipeTransform,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import {
  DataTableAction,
  DataTableColumn,
  DataTableConfig,
} from "../../models/data-table";
import { TooltipDirective } from "../../directives/tooltip.directive";
import { ADMIN_BACKEND_ADAPTER } from "../../config/backend/backend-adapter";
import { PagedData, Pagination } from "../../config/backend/backend-types";

@Component({
  selector: "admin-data-table",
  templateUrl: "./admin-data-table.component.html",
  styleUrls: ["../../admin-shared.css", "./admin-data-table.component.css"],
  imports: [TooltipDirective, CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
})
export class AdminDataTableComponent<T> implements OnChanges {
  @Input() dataLoaded!: boolean;
  @Input() config!: DataTableConfig<T>;
  @Input() data!: T[] | PagedData<T>;
  @Input() searchValue: string | null = null;
  @Input() simpleTable: boolean = false;

  @Output() fetchDataEvent = new EventEmitter<any>();
  @Output() actionClickEvent = new EventEmitter<{
    action: DataTableAction;
    row: any;
  }>();
  @Output() btnClickEvent = new EventEmitter<any>();

  private readonly backendAdapter = inject(ADMIN_BACKEND_ADAPTER);

  readonly pageSize: number = 10;
  rows: T[] = [];
  pagination: Pagination | null = null;
  currentPage: number = 1;
  pages: string[] = [];
  sortBy?: string;
  totalElements!: number;
  sortField?: string;
  sortOrder?: "ASC" | "DESC";

  readonly minSearchLength: number = 3;
  searchForm: FormGroup = new FormGroup({
    keyword: new FormControl(""),
  });

  constructor() {}

  get items(): T[] {
    return Array.isArray(this.data) ? this.data : (this.data?.items ?? []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setPagination();

    if (changes["data"] && changes["data"].isFirstChange()) {
      if (this.searchValue && this.searchValue?.length > 0) {
        this.searchForm.setValue({
          keyword: this.searchValue,
        });
      }

      this.sortBy = this.config.dataOptions?.defaultSort?.field;
      this.sortOrder = this.config.dataOptions?.defaultSort?.order;
      this.emitFetchDataEvent();
    }

    if (this.dataLoaded) {
      this.rows = this.getRows();
    }
  }

  setPagination(): void {
    if (this.pagination !== null) return;

    const enabled = this.config.dataOptions?.pagination === true;
    if (!enabled) return;

    this.pagination = this.backendAdapter.pagination();
  }

  getRows(): T[] {
    if (!this.pagination) {
      return Array.isArray(this.data) ? [...this.data] : [];
    }

    const meta = this.getMetaSource();

    this.currentPage = this.findDeepByPath(
      meta,
      this.pagination.currentPageKey(),
    );
    const totalPages = this.findDeepByPath(
      meta,
      this.pagination.totalPagesKey(),
    );
    this.pages = this.getPages(totalPages);
    this.totalElements = this.findDeepByPath(
      meta,
      this.pagination.totalElementsKey(),
    );

    const content = this.findDeepByPath(this.data, this.pagination.dataKey());
    return Array.isArray(content) ? [...content] : [];
  }

  private getMetaSource(): any {
    if (!this.pagination) return this.data;

    const root = this.pagination.metaRootKey();
    return root ? this.findDeepByPath(this.data, root) : this.data;
  }

  getPages(totalPages: number): string[] {
    const visiblePages: number = 3;

    // Generate an array of page numbers with ellipsis ('...') for gaps beyond the visible page range
    return [...Array(totalPages).keys()]
      .filter(
        (page) =>
          (page < this.currentPage + visiblePages &&
            page >= this.currentPage - visiblePages - 1) ||
          page === 0 ||
          page === totalPages - 1,
      )
      .map((page) => {
        // Insert ellipsis if the page is at the boundary of the visible range
        if (
          page === this.currentPage + visiblePages - 1 ||
          page === this.currentPage - visiblePages - 1
        ) {
          return "...";
        }
        // Otherwise, return the page number as a string (1-based index)
        return (page + 1).toString();
      });
  }

  getHeaderStyle(column: DataTableColumn<T>): { [key: string]: string } {
    const styles: { [key: string]: string } = {};

    // Set default widths if not explicitly set in config
    if (!column.width) {
      if (column.header === "ID") {
        styles["width"] = "5%";
      } else if (column.actions) {
        styles["width"] = "10%";
      } else {
        styles["width"] = "auto";
      }
    } else {
      styles["width"] = column.width;
    }

    // Center align Actions or explicit text-center class
    if (
      column.header === "Akcije" ||
      column.className?.includes("text-center")
    ) {
      styles["text-align"] = "center";
    }

    return styles;
  }

  getText(row: any, columnValue: string) {
    if (columnValue.includes(".")) {
      return this.findDeepByPath(row, columnValue);
    }

    return row[columnValue];
  }

  getColumnText(row: T, column: DataTableColumn<T>) {
    if (column.valueFn) {
      return column.valueFn(row);
    }
    if (column.value) {
      return this.getText(row, column.value);
    }
    return "";
  }

  applyPipe(value: any, pipe?: { instance: PipeTransform; args?: any[] }): any {
    return pipe ? pipe.instance.transform(value, ...(pipe.args ?? [])) : value;
  }

  emitFetchDataEvent(): void {
    if (this.pagination == null) return;

    const requestParams = this.pagination.requestParams(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortOrder,
    );

    const searchConfig = this.config.dataOptions?.search;
    const keyword = this.searchForm.get("keyword")?.value?.trim();

    let filterParams: Record<string, any> = {};

    if (searchConfig && keyword) {
      filterParams = this.backendAdapter.buildFilterParams({
        search: {
          key: searchConfig.key,
          value: keyword,
        },
      });
    }

    // Merge pagination params with filter params for backend request
    this.fetchDataEvent.emit({
      ...requestParams,
      ...filterParams,
    });
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.emitFetchDataEvent();
  }

  onSort(field: string | undefined, clicked: "ASC" | "DESC"): void {
    if (!field) return;
    this.sortField = field;

    if (this.sortBy !== field) {
      // first click on this column → start with the clicked direction
      this.sortBy = field;
      this.sortOrder = clicked;
    } else if (this.sortOrder !== clicked) {
      // clicked opposite arrow → switch direction
      this.sortOrder = clicked;
    } else {
      // clicked same arrow twice → toggle to opposite direction
      this.sortOrder = this.sortOrder === "ASC" ? "DESC" : "ASC";
    }

    if (this.pagination) {
      this.emitFetchDataEvent();
    } else {
      this.sortLocalRows(field, this.sortOrder);
    }
  }

  private sortLocalRows(field?: string, direction?: "ASC" | "DESC"): void {
    if (field === undefined || direction === undefined) {
      return;
    }

    this.rows = [...this.rows].sort((a: any, b: any) => {
      const valueA = a[field];
      const valueB = b[field];

      if (valueA == null && valueB != null) return direction === "ASC" ? -1 : 1;
      if (valueA != null && valueB == null) return direction === "ASC" ? 1 : -1;
      if (valueA == null && valueB == null) return 0;

      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "ASC"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "ASC" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });
  }

  isSortActive(field: string | undefined, sortOrder: "ASC" | "DESC"): boolean {
    return this.sortBy === field && this.sortOrder === sortOrder;
  }

  onSearch(): void {
    this.currentPage = 1;
    const searchValue = this.searchForm.get("keyword")?.value || "";

    // Skip filtering if search text is too short or empty
    if (
      !searchValue &&
      searchValue.length >= 1 &&
      searchValue.length < this.minSearchLength
    ) {
      return;
    }

    if (this.pagination) {
      this.emitFetchDataEvent();
    } else {
      this.filterRows(searchValue, this.getRows());
      this.sortLocalRows(this.sortField, this.sortOrder);
    }
  }

  filterRows(searchText: string, originalRows: T[]): void {
    const lowerSearch = searchText.toLowerCase();

    this.rows = originalRows.filter((row) =>
      this.config.columns.some((column) => {
        const value = this.getColumnText(row, column);
        return value?.toString().toLowerCase().includes(lowerSearch);
      }),
    );
  }

  handleActionClick(action: DataTableAction, row: T): void {
    this.actionClickEvent.emit({ action, row });
  }

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName);
  }

  clearSearch(): void {
    this.searchForm.reset({ keyword: "" });
    this.onSearch();
  }

  findDeepByPath(obj: any | any[], path: any) {
    for (var i = 0, path = path.split("."), len = path.length; i < len; i++) {
      if (obj == null) {
        return "";
      }
      obj = obj[path[i]];
    }

    return obj;
  }

  getItemLabel(count: number): string {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    // 1 stavka (osim ako je 11)
    if (lastDigit === 1 && lastTwoDigits !== 11) {
      return "stavka";
    }

    // 2, 3, 4 stavke (osim ako su 12, 13, 14)
    if (
      [2, 3, 4].includes(lastDigit) &&
      ![12, 13, 14].includes(lastTwoDigits)
    ) {
      return "stavke";
    }

    // sve ostalo (5+, 11–14, 0)
    return "stavki";
  }
}
