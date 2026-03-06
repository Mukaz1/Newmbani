import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfileWidget } from '../../../../marketplace/components/user-profile-widget/user-profile-widget';
import { CurrencyWidget } from '../../../../common/components/currency-widget/currency-widget';

@Component({
  selector: 'app-header',
  imports: [UserProfileWidget, CurrencyWidget],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isCollapsed = false;

  @Output() sidebarOpen = new EventEmitter<void>();

  openSidebar() {
    this.sidebarOpen.emit();
  }
}
