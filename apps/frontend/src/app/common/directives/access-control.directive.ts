/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { confirmPermissions } from '../helpers/permissions.helper';
import { AuthService } from '../../auth/services/auth.service';

@Directive({
  selector: '[appAccessControl]',
})
export class AccessControlDirective implements OnInit {
  private elementRef = inject(ElementRef);
  private auth = inject(AuthService);

  @Input() permission: string | undefined;

  ngOnInit() {
    this.elementRef.nativeElement.style.display = 'none';
    this.checkAccess();
  }
  checkAccess() {
    const permissions: any = this.auth.getPermissions();
    const requiredPermissions = [this.permission ?? ''];

    this.elementRef.nativeElement.style.display = confirmPermissions(
      permissions,
      requiredPermissions
    )
      ? ''
      : 'none';
  }
}
