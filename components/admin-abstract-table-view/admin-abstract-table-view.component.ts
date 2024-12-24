import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DataTableConfig } from '../../models/data-table';
import { ApiResource } from '../../models/api-resource';
import { DataCrudService } from '../../services/data.service';

@Component({
  template: '',
})
export abstract class AdminAbstractTableViewComponent<T extends ApiResource> implements OnInit {
  dataTableConfig!: DataTableConfig;
  dataLoaded: boolean = false;
  errorMessage!: string;
  searchValue!: string | null;

  constructor(private dataService: DataCrudService<T>, private router: Router, private route: ActivatedRoute) { }

  abstract getItemTitle(item: T): string;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
      this.fetchData();
    });
  }

  fetchData(requestParams?: any): void {
    if (requestParams == null) {
      return;
    }
    
    this.dataLoaded = false;
    this.dataService.getPagedItems(requestParams).subscribe({
      next: data => {
        this.dataTableConfig.data = data;
        this.dataLoaded = true;
      },
      error: err => console.log(err)
    });
  }

  deleteItem(item: T): void {
    if (confirm(`Da li želite obrisati ovaj podatak: ${this.getItemTitle(item)}?`)) {
      this.dataService.deleteItem(item.id).subscribe({
        next: () => this.onDelete(),
        error: err => this.errorMessage = err.error.message
      }) 
    }
  }

  onDelete(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.dataTableConfig.baseUrl]);
  }

}
