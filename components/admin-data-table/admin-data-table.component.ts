import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  PipeTransform,
  SimpleChanges,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";

import {
  DataTableAction,
  DataTableColumn,
  DataTableColumnUrl,
  DataTableConfig,
} from "../../models/data-table";
import { Pagination, PaginationFactory } from "../../models/pagination";

@Component({
  selector: "admin-data-table",
  templateUrl: "./admin-data-table.component.html",
  styleUrls: ["../../admin-shared.css", "./admin-data-table.component.css"],
  standalone: false,
})
export class AdminDataTableComponent<T> implements OnChanges {
  @Input() dataLoaded!: boolean;
  @Input() config!: DataTableConfig<T>;
  @Input() searchValue!: string;

  @Output() fetchDataEvent = new EventEmitter<any>();
  @Output() actionClickEvent = new EventEmitter<any>();
  @Output() btnClickEvent = new EventEmitter<any>();

  readonly pageSize: number = 10;
  rows: any[] = [];
  pagination: Pagination | null = null;
  currentPage: number = 1;
  pages: string[] = [];
  sortBy?: string;
  totalElements!: number;
  sortOrder?: "ASC" | "DESC";

  readonly minSearchLength: number = 3;
  searchForm: FormGroup = new FormGroup({
    keyword: new FormControl(""),
  });

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setPagination();

    if (changes["config"] && changes["config"].isFirstChange()) {
      if (this.searchValue?.length > 0) {
        this.searchForm.setValue({
          keyword: this.searchValue,
        });
      }

      this.sortBy = this.config.defaultSort?.field;
      this.sortOrder = this.config.defaultSort?.order;
      this.emitFetchDataEvent();
    }

    if (this.dataLoaded) {
      this.rows = this.getRows();
    }
  }

  setPagination(): void {
    // Return early if pagination is already initialized
    if (this.pagination !== null) {
      return;
    }

    // If pagination configuration is provided, create the appropriate Pagination instance
    if (this.config.pagination !== undefined) {
      this.pagination = PaginationFactory.createPagination(
        this.config.pagination
      );
    }
  }

  getRows(): T[] {
    if (!this.pagination) {
      return this.config.data as T[];
    }

    this.currentPage = this.findDeepByPath(
      this.config.data,
      this.pagination.getCurrentPageKey()
    );
    const numberOfPages = Number(
      this.findDeepByPath(this.config.data, this.pagination.getTotalPagesKey())
    );
    this.pages = this.getPages(numberOfPages);
    this.totalElements = Number(
      this.findDeepByPath(
        this.config.data,
        this.pagination.getTotalElementsKey()
      )
    );

    return this.findDeepByPath(
      this.config.data,
      this.pagination.getContentKey()
    );
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
          page === totalPages - 1
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

  getHeaderStyle(header: string): string {
    if (header === "ID") {
      return "5%";
    }

    if (header === "Akcije") {
      return "25%";
    }

    return "auto";
  }

  getText(row: any, columnValue: string) {
    if (columnValue.includes(".")) {
      return this.findDeepByPath(row, columnValue);
    }

    return row[columnValue];
  }

  getColumnText(row: any, column: DataTableColumn) {
    if (column.values === undefined || column.templateString === undefined) {
      return column.value ? this.getText(row, column.value) : "";
    }

    let text = column.templateString;

    for (let i = 0; i < column.values.length; i++) {
      const templateElement = `[${i}]`;
      const value = this.getText(row, column.values[i]);
      text = text.replace(templateElement, value);
    }

    return text;
  }

  getRouterLink(row: any, url: DataTableColumnUrl): string {
    let link = url.path;

    if (url.value) {
      link += `/${this.findDeepByPath(row, url.value)}`;
    }

    return link;
  }

  applyPipe(value: any, pipe?: { instance: PipeTransform; args?: any[] }): any {
    return pipe ? pipe.instance.transform(value, ...(pipe.args ?? [])) : value;
  }

  handleActionClick<T>(action: DataTableAction, row: T): void {
    this.actionClickEvent.emit({ action, row });
  }

  emitFetchDataEvent(): void {
    if (this.pagination == null) {
      return;
    }

    const requestParams = this.pagination?.getRequestParams(
      this.currentPage,
      this.pageSize,
      this.sortBy,
      this.sortOrder
    );

    if (this.config.search && this.searchForm.get("keyword")?.value) {
      requestParams[this.config.search.key] =
        this.searchForm.get("keyword")?.value;
    }

    this.fetchDataEvent.emit(requestParams);
  }

  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.emitFetchDataEvent();
  }

  onSortChange(field: string | undefined, sortOrder: "ASC" | "DESC"): void {
    if (field) {
      this.sortBy = field;
      this.sortOrder = sortOrder;

      this.emitFetchDataEvent();
    }
  }

  isSortActive(field: string | undefined, sortOrder: "ASC" | "DESC"): boolean {
    return this.sortBy === field && this.sortOrder === sortOrder;
  }

  onSearch(): void {
    this.currentPage = 1;
    const searchKeywordLength = this.searchForm.get("keyword")?.value.length;
    if (
      searchKeywordLength < 1 ||
      searchKeywordLength >= this.minSearchLength
    ) {
      this.emitFetchDataEvent();
    }
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

  handleBtnClick(actionName: string) {
    this.btnClickEvent.emit(actionName);
  }
}
