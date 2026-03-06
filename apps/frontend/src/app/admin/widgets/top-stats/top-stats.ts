import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-top-stats',
  imports: [],
  templateUrl: './top-stats.html',
  styleUrl: './top-stats.scss',
})
export class TopStats implements OnChanges {
  @Input({ required: true }) totalClients = 0;
  @Input({ required: true }) totalBookings = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalClients']) {
      this.totalClients = changes['totalClients'].currentValue;
    }
    if (changes['totalBookings']) {
      this.totalBookings = changes['totalBookings'].currentValue;
    }
  }
}
