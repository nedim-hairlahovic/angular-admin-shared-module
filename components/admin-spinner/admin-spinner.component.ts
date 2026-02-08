import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "admin-spinner",
  templateUrl: "./admin-spinner.component.html",
  styleUrls: ["./admin-spinner.component.scss"],
  standalone: true,
})
export class AdminSpinnerComponent implements OnInit {
  @Input() message: string = "Učitavanje...";
  @Input() size: "sm" | "lg" = "sm";
  @Input() show: boolean = true;

  spinnerSizeClass: string = "";

  ngOnInit(): void {
    this.spinnerSizeClass = this.getSpinnerSize();
  }

  getSpinnerSize(): string {
    return this.size === "lg"
      ? "spinner-border-lg"
      : this.size === "sm"
        ? "spinner-border-sm"
        : "";
  }
}
