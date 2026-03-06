import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-customer-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class CustomerSidebar {
  @Output() sidebarClose = new EventEmitter<void>();

  closeSidebar() {
    this.sidebarClose.emit();
  }
}
