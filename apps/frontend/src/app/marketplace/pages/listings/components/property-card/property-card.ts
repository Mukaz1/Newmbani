import { PropertyListing, PropertyListingTypeEnum } from '@newmbani/types';

import { Component, input, output, computed } from '@angular/core';
import { PricePipe } from '../../../../../common/pipes/price.pipe';
import { NgClass } from '@angular/common';
import { PropertyImageApprovalStatus } from '@newmbani/types';

@Component({
  selector: 'app-property-card',
  imports: [PricePipe, NgClass],
  templateUrl: './property-card.html',
  styleUrl: './property-card.scss',
})
export class PropertyCard {
  PropertyListingTypeEnum = PropertyListingTypeEnum;

  listing = input.required<PropertyListing>();
  isFavorited = input<boolean>(false);

  cardClick = output<PropertyListing>();
  favoriteToggle = output<PropertyListing>();

  images = computed(() => {
    const listing = this.listing();
    if (!listing?.property?.images?.length) return [];
    return listing.property.images.filter(
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
    this.cardClick.emit(this.listing());
  }

  onFavoriteToggle(): void {
    this.favoriteToggle.emit(this.listing());
  }
}
