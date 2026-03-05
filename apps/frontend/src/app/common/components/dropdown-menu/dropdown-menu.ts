// file: src/app/common/components/dropdown-menu/dropdown-menu.ts
import {
  Component,
  Input,
  AfterContentInit,
  ContentChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

export interface DropdownItem {
  label: string;
  icon?: string;
  action?: () => void | Promise<void>;
  link?: string;
  routerLink?: string | any[];
}

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.scss'],
  animations: [
    trigger('dropdownAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-in',
          style({ opacity: 0, transform: 'translateY(-6px)' })
        ),
      ]),
    ]),
  ],
})
export class DropdownMenu implements AfterContentInit {
  @Input() title = 'Menu';
  @Input() items: DropdownItem[] = [];
  @Input() panelClass = '';
  @Input() context?: unknown;

  isOpen = false;

  @ContentChild('[dropdownTrigger]', { read: ElementRef })
  triggerContent?: ElementRef;
  @ContentChild('[dropdownPanel]', { read: ElementRef })
  panelContent?: ElementRef;

  hasCustomTrigger = false;
  hasCustomPanel = false;

  ngAfterContentInit(): void {
    this.hasCustomTrigger = !!this.triggerContent;
    this.hasCustomPanel = !!this.panelContent;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  onItemClick(item: DropdownItem) {
    if (item.action) {
      const action = this.context
        ? item.action.bind(this.context as any)
        : item.action;
      action();
    }
    this.closeDropdown();
  }

  trackByLabel(_: number, item: DropdownItem) {
    return item.label;
  }

  // close when clicking outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // wrapper class is dropdown-trigger-wrapper (see template)
    if (!target.closest('.dropdown-trigger-wrapper')) {
      this.closeDropdown();
    }
  }
}
