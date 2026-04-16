import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "admin-badge",
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="'badge-' + (colorMap[value] || 'light')">
      {{ label || value }}
    </span>
  `,
})
export class AdminBadgeComponent {
  @Input() value: string = "";
  @Input() label: string = "";
  @Input() colorMap: Record<string, string> = {};
}
