import { Landlord, PaginatedData } from '@newmbani/types';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { LandlordsService } from '../../../landlords/services/landlords.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-landlords',
  imports: [RouterLink],
  templateUrl: './top-landlords.html',
  styleUrl: './top-landlords.scss',
})
export class TopLandlords implements OnInit {
  landlords = signal<Landlord[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  @Output() totalLandlords = new EventEmitter<number>();

  pageSize = signal(10);
  currentPage = signal(1);

  destroy$ = new Subject();

  isLoading = signal(false);
  error = signal<string | null>(null);

  private readonly landlordService = inject(LandlordsService);

  ngOnInit(): void {
    this.fetchLandlords();
  }

  fetchLandlords() {
    this.isLoading.set(true);
    this.error.set(null);
    this.landlordService
      .getAllLandlords({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.keyword() || undefined,
      })
      .subscribe({
        next: (res: any) => {
          const landlordsList = res.data.data;
          this.landlords.set(landlordsList);
          this.totalLandlords.emit(landlordsList.length);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(
            err?.error?.message || err.message || 'Failed to load landlords.'
          );
          this.isLoading.set(false);
        },
      });
  }
}
