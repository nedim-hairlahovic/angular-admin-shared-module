import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "admin-modal",
  templateUrl: "./admin-modal.component.html",
  styleUrls: ["../../admin-shared.css", "./admin-modal.component.css"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class AdminModalComponent implements OnChanges {
  @ViewChild("modal", { static: true }) modalRef!: ElementRef;

  @Input() show: boolean = false;
  @Input() title: string = "";
  @Input() size: "sm" | "md" | "lg" | "xl" = "md";
  @Input() contentTemplate?: TemplateRef<any>;

  @Output() closed = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["show"]) {
      this.show ? this.openModal() : this.closeModal();
    }
  }

  openModal(): void {
    const modal = this.modalRef.nativeElement;
    modal.classList.add("show");
    modal.style.display = "block";
    document.body.classList.add("modal-open");
  }

  closeModal(): void {
    const modal = this.modalRef.nativeElement;
    modal.classList.remove("show");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
    this.closed.emit();
  }
}
