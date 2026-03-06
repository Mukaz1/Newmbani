import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfileWidget } from '../../../../marketplace/components/user-profile-widget/user-profile-widget';
import { RouterLink } from '@angular/router';
import { CurrencyWidget } from '../../../../common/components/currency-widget/currency-widget';

@Component({
  selector: 'app-customer-header',
  imports: [UserProfileWidget, RouterLink, CurrencyWidget],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class CustomerHeader {
  @Output() sidebarOpen = new EventEmitter<void>();

  openSidebar() {
    this.sidebarOpen.emit();
  }
}
