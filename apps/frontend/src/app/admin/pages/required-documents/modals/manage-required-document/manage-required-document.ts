import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  Country,
  CreateRequiredDocument,
  NotificationStatusEnum,
  RequiredDocument,
} from '@newmbani/types';
import { Button } from '../../../../../common/components/button/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RequiredDocumentsService } from '../../../../services/required-documents.service';
import { take } from 'rxjs';
import { NotificationService } from '../../../../../common/services/notification.service';
import { CountriesService } from '../../../../../countries/services/countries.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SearchableSelect,
  SearchableSelectOption,
} from '../../../../../marketplace/components/searchable-select/searchable-select';

@Component({
  selector: 'app-view-required-document',
  imports: [Button, ReactiveFormsModule, SearchableSelect],
  templateUrl: './manage-required-document.html',
  styleUrl: './manage-required-document.scss',
})
export class ManageRequiredDocument implements OnInit {
  requiredDocument = inject<RequiredDocument | undefined>(DIALOG_DATA);
  isLoading = signal<boolean>(false);
  countries = signal<Country[]>([]);
  countryOptions = computed(() =>
    this.countries().map(
      (country): SearchableSelectOption => ({
        label: country.name,
        value: country._id,
        description: country.code,
      })
    )
  );

  documentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    isMandatory: new FormControl(false, [Validators.required]),
    countryId: new FormControl('', [Validators.required]),
    isServiceProvider: new FormControl(false, [Validators.required]),
    isPropertyLandlord: new FormControl(false, [Validators.required]),
  });

  private dialogRef = inject(DialogRef);
  private notificationService = inject(NotificationService);
  private readonly requiredDocumentsService = inject(RequiredDocumentsService);
  private readonly countriesService = inject(CountriesService);

  ngOnInit() {
    this.getCountries();

    if (this.requiredDocument) {
      this.documentForm.patchValue({
        countryId: this.requiredDocument?.countryId,
        name: this.requiredDocument?.name,
        isMandatory: this.requiredDocument?.isMandatory,
        isServiceProvider: this.requiredDocument?.isServiceProvider,
        isPropertyLandlord: this.requiredDocument?.isPropertyLandlord,
      });
    }
  }

  getCountries() {
    const countries = this.countriesService.supportedCountries();
    this.countries.set(countries);
  }

  closeModal(): void {
    this.dialogRef.close();
  }
  edit(document: RequiredDocument) {
    this.dialogRef.close({ document, edit: true });
  }

  submit(): void {
    this.isLoading.set(true);
    const { name, isMandatory, isServiceProvider, countryId } =
      this.documentForm.value;
    const payload: CreateRequiredDocument = {
      name: name ? name : this.requiredDocument?.name || '',
      countryId: countryId ? countryId : this.requiredDocument?.countryId || '',
      isServiceProvider: isServiceProvider
        ? isServiceProvider
        : this.requiredDocument?.isServiceProvider || false,
      isPropertyLandlord: isServiceProvider
        ? isServiceProvider
        : this.requiredDocument?.isServiceProvider || false,
      isMandatory: isMandatory
        ? isMandatory
        : this.requiredDocument?.isMandatory || false,
    };
    if (this.requiredDocument && this.requiredDocument._id) {
      this.requiredDocumentsService
        .updateRequiredDocument(this.requiredDocument._id, payload)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              status: NotificationStatusEnum.SUCCESS,
              title: 'Success!',
              message: 'Document updated successfully!',
            });
            this.dialogRef.close(res.data);
          },
          error: (error: HttpErrorResponse) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              title: 'Error!',
              status: NotificationStatusEnum.ERROR,
              message: error.error.message,
            });
            this.isLoading.set(false);
          },
        });
    } else {
      this.requiredDocumentsService
        .createRequiredDocument(payload)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              status: NotificationStatusEnum.SUCCESS,
              title: 'Success!',
              message: 'Document created successfully!',
            });
            this.dialogRef.close(res.data);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading.set(false);
            this.notificationService.notify({
              status: NotificationStatusEnum.ERROR,
              title: 'Error!',
              message: err.error.message,
            });
          },
        });
    }
  }
}
