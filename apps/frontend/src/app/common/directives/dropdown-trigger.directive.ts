import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { DropdownMenu } from '../components/dropdown-menu/dropdown-menu';

@Directive({
  selector: '[appDropdownTrigger]',
})
export class DropdownTriggerDirective {
  @Input('appDropdownTrigger') dropdown!: DropdownMenu;

  private el = inject(ElementRef);

  @HostListener('click')
  toggleDropdown() {
    this.dropdown.open(this.el);
  }
}
