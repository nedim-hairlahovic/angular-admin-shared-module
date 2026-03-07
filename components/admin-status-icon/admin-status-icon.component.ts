import { Component, Input } from '@angular/core';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
  selector: 'admin-status-icon',
  standalone: true,
  imports: [TooltipDirective],
  template: `
    @if (value) {
      <i class="fa fa-check-circle text-success ms-1" [tooltip]="title"></i>
    }
  `,
})
export class AdminStatusIconComponent {
  @Input() value: boolean = false;
  @Input() title: string = '';
}
