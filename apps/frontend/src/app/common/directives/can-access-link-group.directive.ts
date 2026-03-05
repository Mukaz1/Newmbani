/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef, Input, inject, OnInit } from '@angular/core';
import { confirmPermissions } from '../helpers/permissions.helper';
import { AuthService } from '../../auth/services/auth.service';

@Directive({
  selector: '[appCanAccessLinkGroup]',
})
export class CanAccessLinkGroupDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private auth = inject(AuthService);

  @Input() permissions: string[] = [];

  ngOnInit() {
    this.elementRef.nativeElement.style.display = 'none';
    this.checkAccess();
  }

  checkAccess() {
    const permissions: any = this.auth.getPermissions();
    const requiredPermissions = this.permissions;
    // hide or display the element based on the permissions
    this.elementRef.nativeElement.style.display = confirmPermissions(
      permissions,
      requiredPermissions
    )
      ? ''
      : 'none';
  }
}
