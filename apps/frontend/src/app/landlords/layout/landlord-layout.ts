import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './partials/sidebar/sidebar';
import { Header } from './partials/header/header';

@Component({
  selector: 'app-landlord-layout',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './landlord-layout.html',
  styleUrl: './landlord-layout.scss',
})
export class LandlordLayout {
  isMobileSidebarOpen = signal(false);
  isCollapsed = signal(false);

  // This will be triggered from the header's Output event
  onSidebarOpen() {
    this.isMobileSidebarOpen.set(true);
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen.set(false);
  }

  toggleSidebar() {
    this.isCollapsed.update((value) => !value);
  }
}
