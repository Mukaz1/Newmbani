import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { GuestTypeEnum, Guests, PropertyListing } from '@newmbani/types';

@Component({
  selector: 'app-guest-picker',
  standalone: true,
  imports: [],
  templateUrl: './guest-picker.html',
  styleUrls: ['./guest-picker.scss'],
})
export class GuestPicker {
  // Inputs
  listing = input<PropertyListing | null>(null);
  guestsValue = input<Guests | undefined>(undefined);

  // Outputs
  guestsChange = output<Guests>();

  // Expose enum to template
  GuestTypeEnum = GuestTypeEnum;

  guestTypes: GuestTypeEnum[] = [
    GuestTypeEnum.ADULTS,
    GuestTypeEnum.CHILDREN,
    GuestTypeEnum.INFANTS,
    GuestTypeEnum.PETS,
  ];

  // Internal state
  guests = signal<Guests>({
    [GuestTypeEnum.ADULTS]: 0,
    [GuestTypeEnum.CHILDREN]: 0,
    [GuestTypeEnum.INFANTS]: 0,
    [GuestTypeEnum.PETS]: 0,
  });

  // Compute max guests dynamically from listing
  maxGuestsByType = computed<Record<GuestTypeEnum, number>>(() => {
    const currentListing = this.listing();
    return (
      currentListing?.guests ?? {
        [GuestTypeEnum.ADULTS]: Infinity,
        [GuestTypeEnum.CHILDREN]: Infinity,
        [GuestTypeEnum.INFANTS]: Infinity,
        [GuestTypeEnum.PETS]: Infinity,
      }
    );
  });

  constructor() {
    effect(() => {
      const v = this.guestsValue();
      if (v) {
        this.guests.set(v);
      }
    });
  }

  getGuestCount(type: GuestTypeEnum): number {
    return this.guests()[type] ?? 0;
  }

  getMaxForType(type: GuestTypeEnum): number {
    const map = this.maxGuestsByType();
    return map ? map[type] ?? Infinity : Infinity;
  }

  increment(type: GuestTypeEnum) {
    const current = this.getGuestCount(type);
    const max = this.getMaxForType(type);
    if (current >= max) return;
    this.guests.update((g) => ({ ...g, [type]: current + 1 }));
    this.guestsChange.emit(this.guests());
  }

  decrement(type: GuestTypeEnum) {
    const current = this.getGuestCount(type);
    if (current <= 0) return;
    this.guests.update((g) => ({ ...g, [type]: current - 1 }));
    this.guestsChange.emit(this.guests());
  }
}
