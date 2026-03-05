import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  computed,
  input,
  signal,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-view-image-modal',
  imports: [],
  templateUrl: './view-image-modal.html',
  styleUrl: './view-image-modal.scss',
})
export class ViewImageModal implements OnInit, OnDestroy {
  images = input.required<string[]>();
  startIndex = input(0);

  currentIndex = signal(0);

  currentImage = computed(() => {
    const list = this.images();
    const index = this.currentIndex();
    return list?.[index] ?? '';
  });

  isOpen = signal(false);

  private elementRef = inject(ElementRef);

  private keydownHandler = (event: KeyboardEvent) => {
    if (!this.isOpen()) return;
    if (event.key === 'ArrowRight') this.next();
    else if (event.key === 'ArrowLeft') this.previous();
    else if (event.key === 'Escape') this.close();
  };

  ngOnInit() {
    const idx = this.startIndex();
    if (idx >= 0 && idx < this.images().length) {
      this.currentIndex.set(idx);
    }

    // SSR friendly: Attach to host element instead of document.body
    this.elementRef.nativeElement.addEventListener(
      'keydown',
      this.keydownHandler
    );
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener(
      'keydown',
      this.keydownHandler
    );
  }

  next() {
    if (this.images().length > 1) {
      const nextIndex = (this.currentIndex() + 1) % this.images().length;
      this.currentIndex.set(nextIndex);
    }
  }

  previous() {
    if (this.images().length > 1) {
      const prevIndex =
        (this.currentIndex() - 1 + this.images().length) % this.images().length;
      this.currentIndex.set(prevIndex);
    }
  }

  close() {
    this.isOpen.set(false);
  }
}
