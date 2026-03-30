// import {
//   Component,
//   DestroyRef,
//   ElementRef,
//   inject,
//   signal,
//   OnInit,
//   ViewChild,
//   PLATFORM_ID,
// } from '@angular/core';
// import { DatePipe, isPlatformBrowser } from '@angular/common';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormGroup,
//   FormControl,
//   Validators,
//   FormBuilder,
//   FormArray,
// } from '@angular/forms';
// import { RouterLink, Router, ActivatedRoute } from '@angular/router';
// import saveAs from 'file-saver';
// import {
//   Contact,
//   HttpResponseInterface,
//   NotificationStatusEnum,
//   PaginatedData,
// } from '@newmbani/types';
// import { ContactsService } from '../../services/contacts.service';
// import { MetaService } from '../../../../../common/services/meta.service';
// import { CsvExportService } from '../../../../../common/services/csv-export.service';
// import { NotificationService } from '../../../../../common/services/notification.service';
// import { Pagination } from '../../../../../common/components/pagination/pagination';
// import { ConfirmDialog } from '../../../../../common/components/confirm-dialog/confirm-dialog';
// import { Dialog } from '@angular/cdk/dialog';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { take } from 'rxjs';
// import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
// import { DropdownMenu } from '../../../../../common/components/dropdown-menu/dropdown-menu';
// import { SearchInputWidget } from '../../../../../common/components/search-input-widget/search-input-widget';

// @Component({
//   selector: 'app-all-contacts',
//   imports: [
//     RouterLink,
//     FormsModule,
//     ReactiveFormsModule,
//     Pagination,
//     DropdownMenu,
//     SearchInputWidget,
//     DataLoading,
//     DatePipe,
//   ],
//   templateUrl: './all-contacts.html',
//   styleUrls: ['./all-contacts.scss'],
// })
// export class AllContacts implements OnInit {
//   // Signals
//   contacts = signal<Contact[]>([]);
//   isLoading = signal(true);
//   paginatedData = signal<PaginatedData<any> | undefined>(undefined);
//   keyword = signal('');
//   currentPage = signal(1);
//   pageSize = signal(10);
//   selectedContacts = signal<string[]>([]);
//   searchText = signal('');

//   isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

//   @ViewChild('selectAllElement') selectAllElement!: ElementRef;

//   // Services
//   private readonly metaService = inject(MetaService);
//   private readonly contactsService = inject(ContactsService);
//   private readonly router = inject(Router);
//   private readonly fb = inject(FormBuilder);
//   private readonly route = inject(ActivatedRoute);
//   private readonly destroyRef = inject(DestroyRef);
//   private readonly notificationService = inject(NotificationService);
//   private readonly csvExportService = inject(CsvExportService);
//   private readonly dialog = inject(Dialog);

//   form: FormGroup = new FormGroup({});

//   constructor() {
//     this.metaService.setMeta({
//       breadcrumb: {
//         links: [
//           {
//             linkTitle: 'Contacts',
//             isClickable: false,
//           },
//         ],
//       },
//       title: 'Contacts',
//       description: 'Contacts',
//     });
//   }

//   ngOnInit(): void {
//     // Initialize the form
//     this.form = this.fb.group({
//       checkArray: this.fb.array([], [Validators.required]),
//     });

//     this.route.queryParamMap.subscribe((param) => {
//       const isEmpty = param.keys.length === 0;
//       if (isEmpty) {
//         this.patchQueryParams();
//       } else {
//         const pageSize = param.get('limit') || this.pageSize();
//         const keyword = param.get('keyword') || this.keyword();
//         const page = param.get('page') || this.currentPage();

//         this.pageSize.set(+pageSize);
//         this.keyword.set(keyword);
//         this.currentPage.set(+page);
//         this.getContacts();
//       }
//     });
//   }

//   getContacts(): void {
//     this.isLoading.set(true);
//     this.contactsService
//       .getAll({
//         limit: this.pageSize(),
//         page: this.currentPage(),
//         keyword: this.keyword(),
//       })
//       .pipe(take(1))
//       .subscribe({
//         next: (res: HttpResponseInterface) => {
//           const data: PaginatedData | undefined = res.data as PaginatedData;
//           if (data) {
//             this.paginatedData.set(data);
//             this.contacts.set(data.data);
//             this.isLoading.set(false);
//           }
//         },
//         error: (error) => {
//           console.log(error);
//           this.isLoading.set(false);
//         },
//       });
//   }

//   patchQueryParams(): void {
//     this.router.navigate([], {
//       relativeTo: this.route,
//       queryParams: {
//         page: this.currentPage(),
//         keyword: this.keyword(),
//         limit: this.pageSize(),
//       },
//       queryParamsHandling: 'merge',
//     });
//   }

//   onSelectAll(e: Event) {
//     const checkArray = this.form.get('checkArray') as FormArray;
//     const isChecked = (e.target as HTMLInputElement).checked;
//     const contacts = this.contacts();
//     const formValues = this.form.value.checkArray;

//     if (isChecked && contacts) {
//       contacts.forEach((contact) => {
//         const idAlreadyExists = formValues.includes(contact._id);
//         if (!idAlreadyExists) {
//           checkArray.push(new FormControl(contact._id));
//         }
//       });
//     } else {
//       checkArray.clear();
//     }

//     this.getSelectedContacts();
//   }

//   onCheckboxChange(e: Event) {
//     const checkArray = this.form.get('checkArray') as FormArray;
//     const targetValue = (e.target as HTMLInputElement).value;
//     const isChecked = (e.target as HTMLInputElement).checked;

//     if (isChecked) {
//       checkArray.push(new FormControl(targetValue));
//     } else {
//       const index = checkArray.controls.findIndex(
//         (control) => control.value === targetValue
//       );
//       if (index !== -1) {
//         checkArray.removeAt(index);
//       }
//     }

//     this.checkIfAllIsSelected();
//     this.getSelectedContacts();
//   }

//   getSelectedContacts() {
//     this.selectedContacts.set(this.form.value.checkArray);
//   }

//   checkIfAllIsSelected() {
//     if (
//       this.contacts() &&
//       this.contacts().length === this.form.value.checkArray.length
//     ) {
//       this.selectAllElement.nativeElement.checked = true;
//     } else {
//       this.selectAllElement.nativeElement.checked = false;
//     }
//   }

//   isChecked(id: string): boolean {
//     return this.selectedContacts().some((item) => item === id);
//   }

//   onSearchTermChange(value: string) {
//     this.keyword.set(value);
//     this.currentPage.set(1);
//     this.patchQueryParams();
//   }

//   onPageChange(page: number) {
//     this.currentPage.set(page);
//     this.patchQueryParams();
//   }

//   handlePageSizeChange(pageSize: number) {
//     this.pageSize.set(pageSize);
//     this.currentPage.set(1);
//     this.patchQueryParams();
//   }

//   deleteMessage(contact: Contact) {
//     const dialogRef = this.dialog.open(ConfirmDialog, {
//       data: {
//         title: 'Confirm Delete',
//         message: `Are you sure you want to delete the message from "${contact.firstName}"?`,
//         confirmButtonText: 'Delete',
//         cancelButtonText: 'Cancel',
//         confirmButtonStyle:
//           'bg-red-500 text-white rounded-full !hover:bg-red-600 transition-colors',
//       },
//     });

//     dialogRef.closed
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe((confirmed) => {
//         if (confirmed as boolean) {
//           this.contactsService
//             .deleteMessage(contact._id)
//             .pipe(takeUntilDestroyed(this.destroyRef))
//             .subscribe({
//               next: () => {
//                 this.contacts.update((list) =>
//                   list.filter((c) => c._id !== contact._id)
//                 );
//                 this.notificationService.notify({
//                   title: 'Deleted',
//                   message: 'Message deleted successfully',
//                   status: NotificationStatusEnum.SUCCESS,
//                 });
//               },
//               error: (err: Error) => {
//                 this.notificationService.notify({
//                   title: 'Error',
//                   message: err.message,
//                   status: NotificationStatusEnum.ERROR,
//                 });
//               },
//             });
//         }
//       });
//   }

//   /**
//    * Exports data to csv
//    */
//   async exportTableToCSV(): Promise<void> {
//     const data: object[] = [];
//     this.contacts().forEach((contact) => {
//       const entry = {
//         firstName: contact.firstName,
//         LastName: contact.lastName,
//         Email: contact.email,
//         Phone: contact.phone,
//         Purpose: contact.purpose,
//         Message: contact.message,
//       };
//       data.push(entry);
//     });
//     const res = this.csvExportService.exportCSV(data);
//     const timestamp = Date.now().toString();
//     saveAs(res, `Contact_List_${timestamp}.csv`);
//   }
// }
