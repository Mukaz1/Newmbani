import { Component, Output, EventEmitter } from '@angular/core';
import { UserProfileWidget } from '../../../../marketplace/components/user-profile-widget/user-profile-widget';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-customer-header',
  imports: [UserProfileWidget, RouterLink,],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class CustomerHeader {
  @Output() sidebarOpen = new EventEmitter<void>();

  openSidebar() {
    this.sidebarOpen.emit();
  }
}
