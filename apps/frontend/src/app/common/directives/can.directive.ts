import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef,
    effect,
    inject,
  } from '@angular/core';
import { PermissionService } from '../../auth/services/permission.service';
  
  @Directive({
    selector: '[appCan],[appCanAll]',
    standalone: true,
  })
  export class CanDirective {
    private templateRef = inject(TemplateRef<any>);
    private viewContainer = inject(ViewContainerRef);
    private permissionService = inject(PermissionService);
  
  
    private required: string[] = [];
    private mode: 'any' | 'all' = 'any';
  
    @Input()
    set appCan(value: string | string[]) {
      this.required = Array.isArray(value) ? value : [value];
      this.mode = 'any';
    }
  
    @Input()
    set appCanAll(value: string[]) {
      this.required = value;
      this.mode = 'all';
    }
  
    constructor() {
      effect(() => {
        const hasAccess =
          this.mode === 'all'
            ? this.permissionService.hasAll(this.required)
            : this.permissionService.hasAny(this.required);
  
        this.viewContainer.clear();
        if (hasAccess) this.viewContainer.createEmbeddedView(this.templateRef);
      });
    }
  }