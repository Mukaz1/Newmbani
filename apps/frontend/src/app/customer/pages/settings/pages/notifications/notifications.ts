// import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
// import {
//   User,
//   NotificationTypeEnum,
//   NotificationChannelsEnum,
// } from '@newmbani/types';
// import { AuthService } from '../../../../../auth/services/auth.service';
// import { UsersService } from '../../../../../users/services/users.service';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { HttpErrorResponse } from '@angular/common/http';
// import { SlideToggle } from '../../../../../common/components/slide-toggle/slide-toggle';

// type NotificationChannels = `${NotificationChannelsEnum}`;

// type NotificationChannelsObj = {
//   [key in NotificationTypeEnum]?: {
//     whatsapp: boolean;
//     sms: boolean;
//     email: boolean;
//   };
// };

// @Component({
//   selector: 'app-notifications',
//   imports: [SlideToggle],
//   templateUrl: './notification.html',
//   styleUrl: './notifications.scss',
// })
// export class Notifications implements OnInit {
//   private authService = inject(AuthService);
//   private usersService = inject(UsersService);
//   private destroyRef = inject(DestroyRef);

//   user = signal<User | undefined>(undefined);
//   loading = signal(false);

//   // Stores enabled state for each notification type and channel (inApp, push, email)
//   channelEnabledStates = signal<NotificationChannelsObj>({});
//   NotificationTypeEnum = NotificationTypeEnum;
//   notificationTypes = Object.values(NotificationTypeEnum);

//   ngOnInit(): void {
//     const storedUser = this.authService.getStoredUser();
//     if (storedUser) {
//       this.user.set(storedUser);
//       this.loadNotificationPreferences(storedUser._id);
//     }
//   }

//   loadNotificationPreferences(userId: string): void {
//     this.loading.set(true);
//     this.usersService
//       .getUserById(userId)
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe({
//         next: (response) => {
//           this.loading.set(false);
//           const retrievedUser: User =
//             'data' in response ? (response.data as User) : (response as User);
//           this.user.set(retrievedUser);
//           const subs = retrievedUser.notifications ?? [];
//           this.subscriptions.set(subs);

//           // Build up states per notification type
//           const state: NotificationChannelsObj = {};
//           this.notificationTypes.forEach((type) => {
//             const found = subs.find((sub) => sub.notification === type);
//             state[type] = {
//               whatsapp: found?.channels.whatsapp ?? true,
//               sms: found?.channels.sms ?? true,
//               email: found?.channels.email ?? true,
//             };
//           });
//           this.channelEnabledStates.set(state);
//         },
//         error: (err: HttpErrorResponse) => {
//           this.loading.set(false);
//           // TODO: handle error feedback
//         },
//       });
//   }

//   updateSubscriptionsForType(
//     notificationType: NotificationTypeEnum,
//     changes: Partial<NotificationSubScriptions['channels']>
//   ) {
//     const subs = [...this.subscriptions()];
//     const idx = subs.findIndex((sub) => sub.notification === notificationType);

//     if (idx !== -1) {
//       subs[idx] = {
//         ...subs[idx],
//         channels: { ...subs[idx].channels, ...changes },
//       };
//     } else {
//       subs.push({
//         notification: notificationType,
//         channels: {
//           whatsapp: changes.whatsapp ?? true,
//           sms: changes.sms ?? true,
//           email: changes.email ?? true,
//         },
//       });
//     }
//     this.subscriptions.set(subs);

//     // Sync state in parallel
//     const newState: NotificationChannelsObj = {
//       ...this.channelEnabledStates(),
//     };
//     if (!newState[notificationType]) {
//       newState[notificationType] = { whatsapp: true, sms: true, email: true };
//     }
//     newState[notificationType] = { ...newState[notificationType]!, ...changes };
//     this.channelEnabledStates.set(newState);

//     this.loading.set(true); // Add loading state
//     this.usersService
//       .updateUser(this.user()!._id, { notifications: subs })
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe({
//         next: (response) => {
//           this.loading.set(false);
//         },
//         error: (error: HttpErrorResponse) => {
//           this.loading.set(false);
//           console.error('Error updating notification preferences:', error);
//         },
//       });
//   }
//   /**
//    * Toggles the boolean state for a specific notification type and channel.
//    * Called by the template checkboxes.
//    */
//   toggleChannel(
//     notificationType: NotificationTypeEnum,
//     channel: NotificationChannels
//   ): void {
//     const states = this.channelEnabledStates();
//     const currentState = states[notificationType]?.[channel] ?? true;
//     this.updateSubscriptionsForType(notificationType, {
//       [channel]: !currentState,
//     });
//   }

//   // For UI convenience: legacy methods for invoices
//   toggleInApp(): void {
//     this.toggleChannel(NotificationTypeEnum.INVOICES, 'whatsapp');
//   }
//   togglePush(): void {
//     this.toggleChannel(NotificationTypeEnum.INVOICES, 'sms');
//   }
//   toggleEmail(): void {
//     this.toggleChannel(NotificationTypeEnum.INVOICES, 'email');
//   }

//   /**
//    * Returns if a channel is enabled for a specific notification type.
//    * Used by template "[checked]".
//    */
//   isChannelEnabled(
//     notificationType: NotificationTypeEnum,
//     channel: NotificationChannels
//   ): boolean {
//     return this.channelEnabledStates()[notificationType]?.[channel] ?? true;
//   }
// }
