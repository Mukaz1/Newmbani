// import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';
// import { ContactsService } from '../../services/contacts.service';
// import { MetaService } from '../../../../../common/services/meta.service';
// import { Contact } from '@newmbani/types';

// @Component({
//   selector: 'app-view-contact',
//   imports: [],
//   templateUrl: './view-contact.html',
//   styleUrls: ['./view-contact.scss'],
// })
// export class ViewContact implements OnInit, OnDestroy {
//   contact: Contact | null = null;
//   contactId: string | null = null;
//   destroy$ = new Subject();

//   private readonly metaService = inject(MetaService);
//   private readonly route = inject(ActivatedRoute);
//   private readonly router = inject(Router);
//   private readonly contactsService = inject(ContactsService);

//   ngOnInit(): void {
//     this.contactId = this.route.snapshot.paramMap.get('id');

//     if (this.contactId) {
//       // Get the contact related data
//       this.contactsService
//         .getContactById(this.contactId)
//         .pipe(takeUntil(this.destroy$))
//         .subscribe({
//           next: (res: any) => {
//             this.contact = res.data;
//           },
//           error: (err: any) => {
//             console.log(err);
//           },
//         });
//     }

//     this.metaService.setMeta({
//       breadcrumb: {
//         links: [
//           {
//             linkTitle: 'Contacts',
//             isClickable: false,
//           },
//           {
//             linkTitle: 'View Contact',
//             isClickable: false,
//           },
//         ],
//       },
//       title: 'Contact Details',
//       description: 'Contact Details',
//     });
//   }

//   /**
//    * Cleans up component resources when the component is destroyed.
//    * Completes the destroy$ Subject to indicate the component is destroyed.
//    */
//   ngOnDestroy(): void {
//     this.destroy$.next(true);
//     this.destroy$.complete();
//   }
// }
