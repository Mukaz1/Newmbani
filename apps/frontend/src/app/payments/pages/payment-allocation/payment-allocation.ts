import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Invoice,
  NotificationStatusEnum,
  Payment,
  PaymentChannel,
  CreatePaymentAllocation,
  CreatePaymentAllocationItem,
  InvoiceFilterStatus,
} from '@newmbani/types';
import { convertCurrency } from '@newmbani/utils';
import { take } from 'rxjs';
import { NotificationService } from '../../../common/services/notification.service';
import { paymentChannelsData } from '../../data/channels.data';
import { PaymentsService } from '../../services/payments.service';
import { Dialog } from '@angular/cdk/dialog';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../common/components/confirm-dialog/confirm-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InvoicesService } from '../../../invoices/invoices.service';

@Component({
  selector: 'app-payment-allocation',
  imports: [ReactiveFormsModule, FormsModule, ],
  templateUrl: './payment-allocation.html',
  styleUrl: './payment-allocation.scss',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DecimalPipe],
})
export class PaymentAllocation implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly paymentsService = inject(PaymentsService);
  private readonly notificationService = inject(NotificationService);
  private readonly invoicesService = inject(InvoicesService);
  private readonly dialog = inject(Dialog);
  private readonly destroyRef = inject(DestroyRef);

  // Constants / initial data
  paymentId = signal<string | null>(null);
  payment = signal<Payment | null>(null);
  customerId = computed(() => this.payment()?.customerId);
  invoices = signal<Invoice[]>([]);

  // Reactive form controls
  form = this.fb.group({
    invoices: this.fb.array([]),
    search: [''],
    notes: [''],
  });

  // Simple control for two-way template search (keeps parity with original)
  searchCtrl = this.form.get('search')!;

  // filter mode: 'all' | 'overdue' | 'high'
  filterMode: 'all' | 'overdue' | 'high' = 'all';

  // expose constant for template
  private readonly amountToAllocate = computed(
    () => this.payment()?.unAllocatedAmount ?? 0
  );
  constructor() {
    this.paymentId.set(this.route.snapshot.paramMap.get('paymentId'));

    // listen to value changes to recalc and enforce constraints
    this.invoicesArray.valueChanges.subscribe(() => {
      this.enforceConstraints(); // ensure totals not breached, update UI reactive values
    });

    // listen to search changes to trigger UI updates (no heavy filtering here)
    this.searchCtrl.valueChanges.subscribe(() => {
      // no-op; template methods react
    });
  }

  ngOnInit(): void {
    this.getpayment();
  }

  getpayment() {
    const paymentId = this.paymentId();
    if (!paymentId) return;
    this.paymentsService
      .findOne(paymentId)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.payment.set(res.data);
            this.getCustomerInvoicesWithBalance();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify({
            message: error.error.message,
            status: NotificationStatusEnum.ERROR,
            title: 'Error',
          });
        },
      });
  }

  getCustomerInvoicesWithBalance() {
    const customerId = this.customerId();
    const payment = this.payment();
    if (!customerId || !payment) return;
    this.invoicesService
      .findAll({
        limit: -1,
        customerId,
        status: InvoiceFilterStatus.WITH_BALANCE,
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          const unProcessedInvoices: Invoice[] = res.data.data;
          const invoices: Invoice[] = [];

          for (let i = 0; i < unProcessedInvoices.length; i++) {
            const invoice = unProcessedInvoices[i];

            invoice.amountDue = convertCurrency({
              value: invoice.amountDue,
              initialCurrency: invoice.currency,
              targetCurrency: payment.currency,
            });

            invoice.totalAmount = convertCurrency({
              value: invoice.totalAmount,
              initialCurrency: invoice.currency,
              targetCurrency: payment.currency,
            });

            invoice.amountPaid = convertCurrency({
              value: invoice.amountPaid,
              initialCurrency: invoice.currency,
              targetCurrency: payment.currency,
            });

            invoice.currencyId = payment.currencyId.toString();
            invoices.push(invoice);
          }
          this.invoices.set(invoices);
          // populate FormArray
          this.invoices().forEach((inv) => {
            this.invoicesArray.push(this.createInvoiceGroup(inv));
          });
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.notify({
            message:
              error.error?.message ||
              'Failed to load invoices for this customer',
            status: NotificationStatusEnum.ERROR,
            title: 'Error',
          });
        },
      });
  }

  getPaymentChannelIcon(): string {
    const payment = this.payment();
    if (!payment) {
      return '';
    }
    const dd: PaymentChannel | undefined = paymentChannelsData.find(
      (c) => c.channel === payment.paymentChannel
    );
    return dd ? dd.icon : '';
  }

  // FormArray getter
  get invoicesArray(): FormArray {
    return this.form.get('invoices') as FormArray;
  }

  // create FormGroup per invoice
  private createInvoiceGroup(inv: Invoice): FormGroup {
    return this.fb.group({
      invoiceId: [inv._id.toString()],
      serial: [inv.serial],
      date: [inv.createdAt],
      dueDate: [inv.dueDate],
      amountDue: [inv.amountDue],
      allocated: [
        0,
        [Validators.min(0), this.allocationMaxValidator.bind(this)],
      ],
    });
  }

  // Custom validator to ensure allocated <= amountDue
  allocationMaxValidator(control: AbstractControl) {
    const parent = control.parent as FormGroup | null;
    if (!parent) return null;
    const amountDue = parent.get('amountDue')?.value;
    const val = parseFloat(control.value) || 0;
    return val > amountDue ? { exceedInvoice: true } : null;
  }

  // helper: format currency
  formatCurrency(value: number): string {
    if (isNaN(value)) value = 0;
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // helper: format date
  formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // determine overdue relative to the same reference date used in original (2024-10-15)
  isOverdue(dueDate: string) {
    const ref = new Date('2024-10-15');
    return new Date(dueDate) < ref;
  }

  // show/hide invoice row based on search & filter
  showInvoice(index: number): boolean {
    const invoiceControl = this.invoicesArray.at(index);
    if (!invoiceControl) return false;
    const searchTerm = (this.searchCtrl.value || '').toLowerCase();
    const text = `${invoiceControl.get('id')?.value} ${
      invoiceControl.get('date')?.value
    } ${invoiceControl.get('dueDate')?.value} ${
      invoiceControl.get('amountDue')?.value
    }`.toLowerCase();
    if (searchTerm && !text.includes(searchTerm)) return false;

    if (
      this.filterMode === 'overdue' &&
      !this.isOverdue(invoiceControl.get('dueDate')?.value)
    )
      return false;
    if (this.filterMode === 'high') {
      // high value first only affects sorting in allocateAll; for show we still show all
    }
    return true;
  }

  // Returns filtered invoices as Invoice[] with type-correct (but partial) fields for table display
  filteredInvoices(): Partial<Invoice>[] {
    return this.invoicesArray.controls
      .map((invoiceControl) => ({
        serial: invoiceControl.get('serial')?.value,
        date: invoiceControl.get('date')?.value,
        dueDate: invoiceControl.get('dueDate')?.value,
        amountDue: +invoiceControl.get('amountDue')?.value,
        allocated: +invoiceControl.get('allocated')?.value,
        overdue: this.isOverdue(invoiceControl.get('dueDate')?.value),
      }))
      .filter((inv) => {
        if (this.filterMode === 'overdue') return inv.overdue;
        return true;
      });
  }

  // compute total outstanding across current set
  totalOutstanding(): number {
    return this.invoicesArray.controls.reduce(
      (sum, invoiceControl) => sum + +invoiceControl.get('amountDue')?.value,
      0
    );
  }

  // total allocated
  totalAllocated(): number {
    // const alreadyAllocated: number = this.payment()?.allocatedAmount ?? 0;
    return (
      // alreadyAllocated +
      this.invoicesArray.controls.reduce(
        (sum, invoiceControl) => sum + +invoiceControl.get('allocated')?.value,
        0
      )
    );
  }

  // remaining amount from payment
  remainingAmount(): number {
    const rem = this.amountToAllocate() - this.totalAllocated();
    return Math.round((rem + Number.EPSILON) * 100) / 100; // round to cents
  }

  // progress percent (0-100)
  progressPercent(): number {
    const pct = (this.totalAllocated() / this.amountToAllocate()) * 100;
    return Math.min(100, Math.round(pct));
  }

  // selected count (invoices with allocated > 0)
  selectedCount(): number {
    return this.invoicesArray.controls.filter(
      (invoice) => invoice.get('allocated')?.value > 0
    ).length;
  }

  // status badge helper
  statusBadge(invoiceControl: AbstractControl): 'fully' | 'partial' | 'unpaid' {
    const amt = +invoiceControl.get('allocated')?.value;
    const due = +invoiceControl.get('amountDue')?.value;
    if (amt === due && due > 0) return 'fully';
    if (amt > 0 && amt < due) return 'partial';
    return 'unpaid';
  }

  // allocate full for one invoice respecting remaining payment
  allocateFull(index: number) {
    const invoiceControl = this.invoicesArray.at(index);
    if (!invoiceControl) return;
    const amountDue = +invoiceControl.get('amountDue')?.value;
    const currentTotalExcluding =
      this.totalAllocated() - +invoiceControl.get('allocated')?.value;
    const remaining = this.amountToAllocate() - currentTotalExcluding;
    if (remaining <= 0) {
      console.log('No remaining payment to allocate');
      return;
    }
    const toSet = Math.min(amountDue, remaining);
    invoiceControl.get('allocated')?.setValue(this.round2(toSet));
  }

  // clear a single invoice allocation
  clearInvoice(index: number) {
    const invoiceControl = this.invoicesArray.at(index);
    if (!invoiceControl) return;
    invoiceControl.get('allocated')?.setValue(0);
  }

  // toggle checkbox to set allocated to amountDue (if checked) or 0 (if unchecked) while respecting remaining
  onCheckboxToggle($event: Event, index: number) {
    const invoiceControl = this.invoicesArray.at(index);
    const checked =
      typeof ($event.target as HTMLInputElement | null)?.checked === 'boolean'
        ? ($event.target as HTMLInputElement).checked
        : false;
    if (!invoiceControl) return;
    if (checked) {
      // attempt to allocate full or as much as possible
      const amountDue = +invoiceControl.get('amountDue')?.value;
      const currentTotalExcluding =
        this.totalAllocated() - +invoiceControl.get('allocated')?.value;
      const remaining = this.amountToAllocate() - currentTotalExcluding;
      const toSet = Math.min(amountDue, remaining);
      if (toSet <= 0) {
        console.log('No remaining payment to allocate');
        return;
      }
      invoiceControl.get('allocated')?.setValue(this.round2(toSet));
    } else {
      invoiceControl.get('allocated')?.setValue(0);
    }
  }

  // auto allocate across invoices respecting overdue priority and date (same algorithm as original)
  allocateAll() {
    // reset allocations
    this.invoicesArray.controls.forEach((invoiceControl) =>
      invoiceControl.get('allocated')?.setValue(0)
    );
    let remaining = this.amountToAllocate();

    // build array of snapshots, sort by overdue then date (older first)
    const snapshots = this.invoicesArray.controls.map((invoiceControl) => ({
      id: invoiceControl.get('invoiceId')?.value,
      date: new Date(invoiceControl.get('date')?.value),
      dueDate: new Date(invoiceControl.get('dueDate')?.value),
      amountDue: +invoiceControl.get('amountDue')?.value,
    }));

    // sort as original: overdue first then by date ascending
    snapshots.sort((a, b) => {
      const aOver = a.dueDate < new Date('2024-10-15');
      const bOver = b.dueDate < new Date('2024-10-15');
      if (aOver && !bOver) return -1;
      if (!aOver && bOver) return 1;
      return a.date.getTime() - b.date.getTime();
    });

    for (const s of snapshots) {
      if (remaining <= 0) break;
      // find control by id
      const idx = this.invoicesArray.controls.findIndex(
        (invoiceControl) => invoiceControl.get('invoiceId')?.value === s.id
      );
      if (idx === -1) continue;
      const invoiceControl = this.invoicesArray.at(idx);
      const allocate = Math.min(s.amountDue, remaining);
      invoiceControl.get('allocated')?.setValue(this.round2(allocate));
      remaining =
        Math.round((remaining - allocate + Number.EPSILON) * 100) / 100;
    }
  }

  // clear all allocations after confirmation
  clearAll() {
    if (!confirm('Clear all allocations?')) return;
    this.invoicesArray.controls.forEach((invoiceControl) =>
      invoiceControl.get('allocated')?.setValue(0)
    );
  }

  // ensure constraints: no single invoice > amountDue, and total <= TOTAL_PAYMENT
  enforceConstraints() {
    // enforce per-invoice allocation <= amountDue (validator handles this but also normalize)
    this.invoicesArray.controls.forEach((invoiceControl) => {
      const allocated = +invoiceControl.get('allocated')?.value || 0;
      const amountDue = +invoiceControl.get('amountDue')?.value || 0;
      if (allocated > amountDue) {
        console.log('Allocation cannot exceed invoice amount');
        invoiceControl.get('allocated')?.setValue(this.round2(amountDue));
      }
    });

    // ensure total allocation <= TOTAL_PAYMENT
    const total = this.totalAllocated();
    if (total > this.amountToAllocate()) {
      console.log(
        'Total allocation cannot exceed payment amount of ' +
          this.formatCurrency(this.amountToAllocate())
      );
      // revert last changes to fit into TOTAL_PAYMENT (simple approach: scale down proportionally)
      const scale = this.amountToAllocate() / total;
      this.invoicesArray.controls.forEach((invoiceControl) => {
        const current = +invoiceControl.get('allocated')?.value;
        invoiceControl.get('allocated')?.setValue(this.round2(current * scale));
      });
    }
  }

  // Save allocation - replicates original behavior including console.logs & console log
  saveAllocation() {
    const totalAllocated = this.totalAllocated();
    const payment = this.payment();
    if (
      totalAllocated === 0 ||
      totalAllocated > this.amountToAllocate() ||
      !payment
    ) {
      return;
    }
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Payment Allocation',
      description: `Are you sure you want to allocate ${
        payment.currency.code
      } ${totalAllocated} of ${
        payment.currency.code
      } ${this.amountToAllocate()} to selected invoices?`,
      message:
        'This action will finalize the allocation of the selected payment amount to the invoices. You will not be able to undo this allocation.',
    };
    const modalRef = this.dialog.open(ConfirmDialog, {
      disableClose: true,
      data: dialogData,
    });

    modalRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        const ok = result as boolean;
        if (ok) {
          //
          const allocatedItems: Omit<
            CreatePaymentAllocationItem,
            'allocationId'
          >[] = this.invoicesArray.controls
            .map((invoiceControl) => ({
              invoiceId: invoiceControl.get('invoiceId')?.value as string,
              paymentId: payment._id.toString(),
              amount: +invoiceControl.get('allocated')?.value,
              currencyId: payment.currencyId.toString(),
              allocationDate: new Date().toISOString(),
            }))
            .filter((i) => i.amount > 0);

          const unallocated =
            Math.round(
              (this.amountToAllocate() - totalAllocated + Number.EPSILON) * 100
            ) / 100;

          const allocation: Omit<CreatePaymentAllocation, 'serial'> = {
            paymentId: payment._id.toString(),
            currencyId: payment.currencyId.toString(),
            amount: totalAllocated,
            allocationDate: new Date(),
            notes: this.form.value.notes ?? '',
            allocations: allocatedItems,
          };
          this.paymentsService
            .createPaymentAllocation(allocation)
            .pipe(take(1))
            .subscribe({
              next: (res) => {
                this.notificationService.notify({
                  title: res.message || 'Allocation Successful',
                  message:
                    'The payment allocation has been saved successfully.',
                  status: NotificationStatusEnum.SUCCESS,
                });
                this.navigateToPayments();
              },
              error: (error) => {
                console.log(error);
                this.notificationService.notify({
                  title: 'Allocation failed',
                  message:
                    'An error occurred while saving the payment allocation. Please try again, or contact support if the problem persists.',
                  status: NotificationStatusEnum.ERROR,
                });
              },
            });
        }
      });
  }

  // small helpers
  round2(n: number) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  // class for remaining display
  remainingClass() {
    const rem = this.remainingAmount();
    if (rem < 0) return 'text-red-600';
    if (rem === 0) return 'text-primary-600';
    return 'text-green-600';
  }

  // navigation / print
  navigateToPayments() {
    this.router.navigate(['/admin/payments']);
  }
  print() {
    window.print();
  }

  // trackBy for performance
  trackByInvoice = (index: number, invoiceControl: AbstractControl) =>
    invoiceControl.get('id')?.value;
}
