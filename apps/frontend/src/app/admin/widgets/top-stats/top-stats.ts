import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-top-stats',
  imports: [],
  templateUrl: './top-stats.html',
  styleUrl: './top-stats.scss',
})
export class TopStats  {
  @Input({ required: true }) totalLandlords = 0;
  @Input({ required: true }) totalBookings = 0;
  @Input({ required: true }) totalProperties = 0;
  @Input({ required: true }) highestProperty = 0;


}
