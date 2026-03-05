import { Component, input } from '@angular/core';
import { PropertyImage } from '@newmbani/types';

@Component({
  selector: 'app-property-images',
  imports: [],
  templateUrl: './property-images.html',
  styleUrl: './property-images.scss',
})
export class PropertyImages {
  readonly images = input.required<PropertyImage[]>();
  selectedIndex = 0;

  // Navigate to the previous image
  previousImage(): void {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.images().length) % this.images().length;
  }

  // Navigate to the next image
  nextImage(): void {
    this.selectedIndex = (this.selectedIndex + 1) % this.images().length;
  }

  // Select a specific image
  selectImage(index: number): void {
    this.selectedIndex = index;
  }
}
