import { inject, Injectable, linkedSignal } from '@angular/core';
import { PermissionEnum } from '@newmbani/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private authService = inject(AuthService);
 
  private _permissions = linkedSignal(()=>this.authService.permissions())

  setPermissions(perms: string[]) {
    this._permissions.set(perms);
  }

  hasAny(permissions: string[]) {
    const current = this._permissions();
    if (current.includes(PermissionEnum.MANAGE_ALL)) return true;
    return permissions.some((p) => current.includes(p));
  }

  hasAll(permissions: string[]) {
    const current = this._permissions();
    if (current.includes(PermissionEnum.MANAGE_ALL)) return true;
    return permissions.every((p) => current.includes(p));
  }

  watch() {
    return this._permissions.asReadonly();
  }

  
}