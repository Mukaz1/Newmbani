import { GoogleMapsModule } from '@angular/google-maps';
import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  PLATFORM_ID,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-property-location',
  templateUrl: './property-location.html',
  imports: [GoogleMapsModule],
  styleUrls: ['./property-location.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyLocation {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Nairobi fallback
  @Input() latitude = -1.286389;
  @Input() longitude = 36.817223;
  @Input() propertyName = 'Property Location';
  @Input() zoom = 15;

  mapLoaded = false;

  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  };

  get position(): google.maps.LatLngLiteral {
    return { lat: this.latitude, lng: this.longitude };
  }

  openFullMap() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(
        `https://www.google.com/maps?q=${this.latitude},${this.longitude}`,
        '_blank'
      );
    }
  }
}
