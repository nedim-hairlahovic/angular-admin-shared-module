import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'admin-image-upload',
  templateUrl: './admin-image-upload.component.html',
  styleUrls: ['./admin-image-upload.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AdminImageUploadComponent implements OnChanges {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /** URL of the currently saved image (from entity in edit mode). */
  @Input() currentImageUrl?: string | null;

  /** Accepted MIME types, e.g. 'image/jpeg,image/png'. */
  @Input() accept: string = 'image/*';

  /** Maximum file size in bytes. No limit when undefined. */
  @Input() maxSizeBytes?: number;

  /** Whether the control is in an invalid state. */
  @Input() invalid: boolean = false;

  /**
   * Display variant.
   * - `'default'`: compact click-to-upload square (for inline form use)
   * - `'card'`:    sidebar-style presentation with larger preview and a button
   */
  @Input() variant: 'default' | 'card' = 'default';

  /** Emits the selected File, or null when the selection is cleared. */
  @Output() fileChange = new EventEmitter<File | null>();

  /** Emits when the user clicks the delete/remove button (card variant only). */
  @Output() deleteRequest = new EventEmitter<void>();

  previewUrl: string | null = null;
  errorMessage: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentImageUrl']) {
      if (this.currentImageUrl == null) {
        // Parent cleared the URL (e.g. after delete) — reset local preview
        this.previewUrl = null;
        if (this.fileInput?.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
      } else if (!this.previewUrl) {
        this.previewUrl = this.currentImageUrl;
      }
    }
  }

  triggerFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.errorMessage = null;

    if (!file) {
      return;
    }

    if (this.maxSizeBytes && file.size > this.maxSizeBytes) {
      const limitMb = (this.maxSizeBytes / 1024 / 1024).toFixed(1);
      this.errorMessage = `Fajl je prevelik. Maksimalna veličina je ${limitMb} MB.`;
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.fileChange.emit(file);
  }

  clearImage(): void {
    this.previewUrl = null;
    this.errorMessage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileChange.emit(null);
  }
}
