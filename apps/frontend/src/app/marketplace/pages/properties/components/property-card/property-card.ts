import { Property, } from '@newmbani/types';

import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { PropertyImageApprovalStatus } from '@newmbani/types';

@Component({
  selector: 'app-property-card',
  imports: [ NgClass],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
})
export class PropertyCard {

  property = input.required<Property>();
  isFavorited = input<boolean>(false);

  cardClick = output<Property>();
  favoriteToggle = output<Property>();

  images = computed(() => {
    const property = this.property();
    if (!property?.images?.length) return [];
    return property.images.filter(
      (img) => img.approvalStatus === PropertyImageApprovalStatus.APPROVED
    );
  });

  cardImageUrl = computed(() => {
    const images = this.images();
    if (images.length > 0) {
      return images[0].link || '/assets/images/no-image.jpg';
    }
    return '/assets/images/no-image.jpg';
  });

  onCardClick(): void {
    this.cardClick.emit(this.property());
  }

  onFavoriteToggle(): void {
    this.favoriteToggle.emit(this.property());
  }
}
