import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DetailsViewRow } from '../../models/details-view';

@Component({
  selector: 'admin-details-view',
  templateUrl: './admin-details-view.component.html',
  styleUrls: ['../../admin-shared.css', './admin-details-view.component.css']
})
export class AdminDetailsViewComponent implements OnInit {
  @Input() id!: any;
  @Input() title!: string;
  @Input() rows: DetailsViewRow[] = [];
  @Input() onBackUrl!: string;
  @Input() onEditUrl!: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigate([this.onBackUrl]);
  }

  onEdit() {
    if (this.onEditUrl) {
      this.router.navigate([this.onEditUrl]);
      return;
    }

    const editUrl = `${this.onBackUrl}/${this.id}/edit`;
    this.router.navigate([editUrl]);
  }

}
