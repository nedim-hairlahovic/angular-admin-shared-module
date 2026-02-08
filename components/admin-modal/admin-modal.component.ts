import {
  AfterViewInit,
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
  styleUrls: ["./admin-modal.component.scss"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class AdminModalComponent implements OnChanges, AfterViewInit {
  @ViewChild("modal", { static: true }) modalRef!: ElementRef;
  @ViewChild("backdrop", { static: true }) backdropRef!: ElementRef;

  @Input() show: boolean = false;
  @Input() title: string = "";
  @Input() size: "sm" | "md" | "lg" | "xl" = "md";
  @Input() contentTemplate?: TemplateRef<any>;

  @Output() closed = new EventEmitter<void>();

  ngAfterViewInit(): void {
    // Initialize backdrop as hidden
    this.backdropRef.nativeElement.style.display = "none";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["show"]) {
      this.show ? this.openModal() : this.closeModal();
    }
  }

  openModal(): void {
    const modal = this.modalRef.nativeElement;
    const backdrop = this.backdropRef.nativeElement;

    modal.classList.add("show");
    modal.style.display = "block";
    backdrop.classList.add("show");
    backdrop.style.display = "block";
    document.body.classList.add("modal-open");
  }

  closeModal(): void {
    const modal = this.modalRef.nativeElement;
    const backdrop = this.backdropRef.nativeElement;

    modal.classList.remove("show");
    modal.style.display = "none";
    backdrop.classList.remove("show");
    backdrop.style.display = "none";
    document.body.classList.remove("modal-open");
    this.closed.emit();
  }
}
