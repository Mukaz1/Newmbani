import { Component, inject, OnInit, signal } from '@angular/core';
import { PaginatedData,Property } from '@newmbani/types';
import { take } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../common/services/notification.service';
import { PropertiesService } from '../../../properties/services/properties.service';

@Component({
  selector: 'app-top-selling-properties',
  imports: [],
  templateUrl: './top-selling-properties.html',
  styleUrl: './top-selling-properties.scss',
})
export class TopSellingProperties implements OnInit {
 properties = signal<Property[] | []>([]);
  isLoading = signal(true);
  paginatedData = signal<PaginatedData<any> | undefined>(undefined);
  keyword = signal('');
  currentPage = signal(1);
  pageSize = signal(5);

  private readonly propertieservice = inject(PropertiesService);
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.getPropertyListings();
  }

  getPropertyListings() {
    this.isLoading.set(true);
    this.propertieservice
      .getAllProperties({
        keyword: this.keyword(),
        limit: this.pageSize(),
        page: this.currentPage(),
      })
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.paginatedData.set(res.data);
          this.properties.set(res.data.data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.log(error);
          this.isLoading.set(false);
        },
      });
  }
}
