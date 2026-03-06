import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';
import { PropertyImage } from '@newmbani/types';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.html',
  styleUrls: ['./photo-modal.scss'],
})
export class PhotoModal implements OnInit, OnChanges {
  @Input() images: PropertyImage[] = [];
  imageLinks = signal<string[]>([]);
  @Input() initialIndex = 0;
  @Output() closeModal = new EventEmitter<void>();

  currentIndex = 0;
  private startX: number | null = null;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      const images: PropertyImage[] = changes['images'].currentValue;
      this.imageLinks.set(images.map((img) => img.link));
    }
  }
  ngOnInit() {
    this.currentIndex = this.initialIndex;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  onClose() {
    this.closeModal.emit();
  }

  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    if (this.startX === null) return;
    const endX = event.changedTouches[0].clientX;
    const diff = endX - this.startX;
    if (diff > 50) {
      this.prev();
    } else if (diff < -50) {
      this.next();
    }
    this.startX = null;
  }
}
