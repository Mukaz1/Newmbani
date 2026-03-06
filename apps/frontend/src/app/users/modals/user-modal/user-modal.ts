import { Component, OnInit, inject } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { User, NotificationStatusEnum } from '@newmbani/types';
import { UsersService } from '../../../admin/services/users.service';
import { NotificationService } from '../../../common/services/notification.service';

@Component({
  selector: 'app-user-modal',

  imports: [ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal implements OnInit {
  userForm: FormGroup;

  private fb = inject(FormBuilder);
  private dialogRef = inject(DialogRef);
  private readonly usersService = inject(UsersService);
  private notificationService = inject(NotificationService);
  private data = inject<{ user: User | undefined; title: string }>(DIALOG_DATA);
  isEditMode = !!this.data.user;
  title = this.data.title;

  constructor() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // If in edit mode, patch the form with existing user data
    if (this.data.user) {
      this.userForm.patchValue(this.data.user);
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;

    if (this.data.user) {
      // Update existing user
      this.usersService.updateUser(this.data.user?._id, userData).subscribe({
        next: (res) => {
          this.notificationService.notify({
            title: 'Success',
            message: 'User updated successfully',
            status: NotificationStatusEnum.SUCCESS,
          });
          this.dialogRef.close(res.data);
        },
        error: (error) => {
          this.notificationService.notify({
            title: 'Error',
            message: error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
    } else {
      // Create new user
      this.usersService.addUser(userData).subscribe({
        next: (res) => {
          this.notificationService.notify({
            title: 'Success',
            message: 'User created successfully',
            status: NotificationStatusEnum.SUCCESS,
          });
          this.dialogRef.close(res.data);
        },
        error: (error) => {
          this.notificationService.notify({
            title: 'Error',
            message: error.message,
            status: NotificationStatusEnum.ERROR,
          });
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
