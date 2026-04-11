import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[tooltip]",
  standalone: true,
})
export class TooltipDirective implements OnChanges, OnDestroy {
  @Input("tooltip") tooltipText!: string;

  private tooltipEl?: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    if (this.tooltipEl) {
      this.tooltipEl.innerText = this.tooltipText;
    }
  }

  @HostListener("mouseenter")
  onMouseEnter() {
    if (!this.tooltipText) return;

    // Create tooltip element
    this.tooltipEl = this.renderer.createElement("span");
    if (this.tooltipEl === undefined) {
      return;
    }
    this.tooltipEl.innerText = this.tooltipText;
    this.renderer.addClass(this.tooltipEl, "custom-tooltip");

    document.body.appendChild(this.tooltipEl);

    // Position tooltip above the element after it's in the DOM so we can measure its height
    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipHeight = this.tooltipEl.offsetHeight;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const gap = 8;

    this.renderer.setStyle(
      this.tooltipEl,
      "top",
      `${hostPos.top + scrollY - tooltipHeight - gap}px`,
    );
    this.renderer.setStyle(
      this.tooltipEl,
      "left",
      `${hostPos.left + hostPos.width / 2}px`,
    );
  }

  @HostListener("mouseleave")
  onMouseLeave() {
    this.removeTooltip();
  }

  ngOnDestroy(): void {
    this.removeTooltip();
  }

  private removeTooltip(): void {
    if (this.tooltipEl) {
      document.body.removeChild(this.tooltipEl);
      this.tooltipEl = undefined;
    }
  }
}
