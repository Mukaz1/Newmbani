import { Component, signal } from '@angular/core';
import { TopCategories } from '../../widgets/top-categories/top-categories';
import { WelcomeCard } from '../../widgets/welcome-card/welcome-card';
import { TopStats } from '../../widgets/top-stats/top-stats';
import { TopSellingProperties } from '../../widgets/top-selling-properties/top-selling-properties';
import { LatestBookings } from '../../../bookings/components/latest-bookings/latest-bookings';
import { TopHosts } from '../../widgets/top-hosts/top-hosts';

@Component({
  selector: 'app-dashboard',
  imports: [
    TopCategories,
    TopSellingProperties,
    WelcomeCard,
    TopHosts,
    TopStats,
    LatestBookings,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboard {
  totalClients = signal(0);
  totalBookings = signal(0);

  setTotalClients(clients: number) {
    this.totalClients.set(clients);
  }
  setTotalBookings(bookings: number) {
    this.totalBookings.set(bookings);
  }
}
