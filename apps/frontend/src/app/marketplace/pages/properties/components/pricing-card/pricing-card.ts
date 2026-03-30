// import {
//   NotificationStatusEnum,
//   Booking,
// } from '@newmbani/types';
// import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
// import { DatePicker } from '../../../../../common/components/date-picker/date-picker';
// import { Button } from '../../../../../common/components/button/button';
// import {
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { Dialog } from '@angular/cdk/dialog';
// import { ActivatedRoute, Router } from '@angular/router';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { NotificationService } from '../../../../../common/services/notification.service';
// import { AuthService } from '../../../../../auth/services/auth.service';
// import { getDaysFromDates } from '@newmbani/utils';
// import { BookingMessage } from '../booking-message/booking-message';

@Component({
  selector: 'app-pricing-card',
  imports: [
   
  ],
  templateUrl: './pricing-card.html',
  styleUrl: './pricing-card.scss',
})
export class PricingCard  {
//   showDatePicker = false;
//   showGuestPicker = false;
//   PropertyListingTypeEnum = PropertyListingTypeEnum;
//   currentListing = input<PropertyListing | null>(null);
//   activeDateField = signal<'checkIn' | 'checkOut' | 'appointment' | null>(null);
//   checkIn = signal<Date | null>(null);
//   checkOut = signal<Date | null>(null);
//   appointment = signal<Date | null>(null);
//   guests = signal<Guests>({
//     [GuestTypeEnum.ADULTS]: 1,
//     [GuestTypeEnum.CHILDREN]: 0,
//     [GuestTypeEnum.INFANTS]: 0,
//     [GuestTypeEnum.PETS]: 0,
//   });
//   userType = computed(() => this.authService.getUserType());

//   private dialog = inject(Dialog);
//   private destroyRef = inject(DestroyRef);
//   private router = inject(Router);
//   private propertyListingService = inject(PropertyListingService);
//   private notificationService = inject(NotificationService);
//   private authService = inject(AuthService);
//   isLoggedIn = this.authService.isAuthenticated();
//   booking = signal<Booking | null>(null);
//   unavailableDates = signal<Date[]>([]);
//   private route = inject(ActivatedRoute);

//   bookingItemsForm = new FormGroup({
//     type: new FormControl<BookingTypeEnum>(BookingTypeEnum.LISTING, {
//       nonNullable: true,
//     }),
//     quantity: new FormControl<number>(1),
//     price: new FormControl<number>(0),
//     metadata: new FormGroup({
//       checkIn: new FormControl<Date | null>(null),
//       checkOut: new FormControl<Date | null>(null),
//       appointment: new FormControl<Date | null>(null),
//       offer: new FormControl<number>(0),
//       duration: new FormControl<number | null>(null),
//       guests: new FormGroup({
//         [GuestTypeEnum.ADULTS]: new FormControl<number>(1),
//         [GuestTypeEnum.CHILDREN]: new FormControl<number>(0),
//         [GuestTypeEnum.INFANTS]: new FormControl<number>(0),
//         [GuestTypeEnum.PETS]: new FormControl<number>(0),
//       }),
//     }),
//   });

//   ngOnInit(): void {
//     this.getUnavailableDates();
//   }

//   private getUnavailableDates() {
//     const listingId = this.currentListing()?._id.toString();
//     if (!listingId) return;
//     this.propertyListingService
//       .getPropertyListingSchedule(listingId)
//       .subscribe({
//         next: (response) => {
//           const unavailable = (response.data ?? []).map(
//             (date: string | Date) => new Date(date)
//           );
//           this.unavailableDates.set(unavailable);
//         },
//         error: (err) => {
//           console.log(err);
//           this.unavailableDates.set([]);
//         },
//       });
//   }

//   get guestsValue(): Guests {
//     const raw = this.bookingItemsForm.get('metadata.guests')?.value;
//     return {
//       adults: raw?.adults ?? 1,
//       children: raw?.children ?? 0,
//       infants: raw?.infants ?? 0,
//       pets: raw?.pets ?? 0,
//     };
//   }
//   get metadata() {
//     return this.bookingItemsForm.value.metadata;
//   }

//   onCheckInChange(value: Date | null) {
//     this.bookingItemsForm.get('metadata.checkIn')?.setValue(value);
//     this.activeDateField.set('checkOut');
//   }

//   onCheckOutChange(value: Date | null) {
//     this.bookingItemsForm.get('metadata.checkOut')?.setValue(value);
//     this.showDatePicker = false;
//   }
//   onAppointmentChange(value: Date | null) {
//     this.bookingItemsForm.get('metadata.appointment')?.setValue(value);
//     this.showDatePicker = false;
//   }

//   onDatesChange(dates: { checkIn: Date | null; checkOut: Date | null }) {
//     this.checkIn.set(dates.checkIn);
//     this.checkOut.set(dates.checkOut);
//   }

//   toggleDateField(field: 'checkIn' | 'checkOut' | 'appointment') {
//     this.activeDateField.set(this.activeDateField() === field ? null : field);
//   }
//   onGuestsChange(updatedGuests: Guests) {
//     this.guests.set(updatedGuests);
//   }

//   totalGuests(): number {
//     const g = this.currentListing()?.guests;
//     if (!g) return 0;
//     return (g.adults ?? 0) + (g.children ?? 0) + (g.infants ?? 0);
//   }
//   toggleDatePicker() {
//     this.showDatePicker = !this.showDatePicker;
//   }
//   toggleGuestPicker() {
//     this.showGuestPicker = !this.showGuestPicker;
//   }
//   redirectToLogin() {
//     const currentUrl = this.router.url;
//     this.router.navigate(['/auth/login/email'], {
//       queryParams: { redirectTo: currentUrl },
//     });
//   }

//   get totalDays(): number {
//     const checkIn = this.bookingItemsForm.get('metadata.checkIn')?.value;
//     const checkOut = this.bookingItemsForm.get('metadata.checkOut')?.value;

//     if (!checkIn || !checkOut) return 0;

//     return getDaysFromDates({ checkIn, checkOut });
//   }
//   get totalPrice(): number {
//     const pricePerNight = this.currentListing()?.pricing?.price ?? 0;
//     return this.totalDays * pricePerNight;
//   }

//   bookProperty() {
//     this.showDatePicker = false;
//     this.showGuestPicker = false;
//     const listing = this.currentListing();

//     if (!listing) return;
//     const formValue = this.bookingItemsForm.value;
//     // --- Constraints ---
//     if (listing.type === PropertyListingTypeEnum.BNB) {
//       const checkIn = formValue.metadata?.checkIn;
//       const checkOut = formValue.metadata?.checkOut;
//       if (!checkIn || !checkOut) {
//         this.notificationService.notify({
//           message:
//             'Please select both check-in and check-out dates before booking.',
//           title: 'Dates Required',
//           status: NotificationStatusEnum.ERROR,
//         });
//         return;
//       }
//     }

//     if (listing.type === PropertyListingTypeEnum.SALE) {
//       const appointment = formValue.metadata?.appointment;
//       if (!appointment) {
//         this.notificationService.notify({
//           message: 'Please select a viewing date and time before booking.',
//           title: 'Appointment Required',
//           status: NotificationStatusEnum.ERROR,
//         });
//         return;
//       }
//     }

//     // --- Construct Booking Item ---
//     const guests = this.guests();
//     // Use days as the quantity for the booking item if BNB, else fall back to form value or 1
//     let quantity = 1;
//     if (listing.type === PropertyListingTypeEnum.BNB) {
//       const checkIn = formValue.metadata?.checkIn ?? undefined;
//       const checkOut = formValue.metadata?.checkOut ?? undefined;
//       // Ensure checkIn and checkOut are valid for getDaysFromDates
//       quantity =
//         checkIn && checkOut ? getDaysFromDates({ checkIn, checkOut }) || 1 : 1;
//     } else {
//       quantity = formValue.quantity ?? 1;
//     }

//     const bookingItem: CreateBookingItem = {
//       type: BookingTypeEnum.LISTING,
//       reference: listing._id,
//       quantity,
//       metadata: {
//         checkIn: formValue.metadata?.checkIn ?? undefined,
//         checkOut: formValue.metadata?.checkOut ?? undefined,
//         appointment: formValue.metadata?.appointment ?? undefined,
//         offer: formValue.metadata?.offer ?? undefined,
//         duration: formValue.metadata?.duration ?? undefined,
//         guests: {
//           adults: guests.adults ?? 0,
//           children: guests.children ?? 0,
//           infants: guests.infants ?? 0,
//           pets: guests.pets ?? 0,
//         },
//       },
//     };

//     // --- Flow ---
//     if (listing.type === PropertyListingTypeEnum.BNB) {
//       const modalRef = this.dialog.open(BookingModal, {
//         data: { bookingItem, listing },
//       });

//       modalRef.closed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
//         next: (result) => {
//           const booking = (result as { booking?: Booking })?.booking;
//           if (booking?._id) {
//             this.booking.set(booking);
//             if (
//               listing.pricing.bookingPaymentTerms &&
//               listing.pricing.bookingPaymentTerms ===
//                 BookingPaymentTerms.ON_BOOKING
//             ) {
//               this.router.navigateByUrl(`/pay/${booking._id}`);
//             } else {
//               this.dialog.open(BookingMessage, {
//                 data: {
//                   booking: booking,
//                 },
//               });
//             }
//           }
//         },
//       });
//     } else {
//       this.notificationService.notify({
//         message: 'Your appointment for viewing the property has been booked!',
//         title: 'Viewing Booked',
//         status: NotificationStatusEnum.SUCCESS,
//       });
//     }
//   }
}
