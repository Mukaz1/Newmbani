import { Host, PaginatedData } from '@newmbani/types';
import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Subject } from 'rxjs';
import { HostsService } from '../../../landlords/services/landlords.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-hosts',
  imports: [RouterLink],
  templateUrl: './top-hosts.html',
  styleUrl: './top-hosts.scss',
})
export class TopHosts implements OnInit {
  hosts = signal<Host[]>([]);
  paginatedData = signal<PaginatedData | undefined>(undefined);
  keyword = signal('');
  @Output() totalHosts = new EventEmitter<number>();

  pageSize = signal(10);
  currentPage = signal(1);

  destroy$ = new Subject();

  isLoading = signal(false);
  error = signal<string | null>(null);

  private readonly hostService = inject(HostsService);

  ngOnInit(): void {
    this.fetchHosts();
  }

  fetchHosts() {
    this.isLoading.set(true);
    this.error.set(null);
    this.hostService
      .getAllHosts({
        limit: this.pageSize(),
        page: this.currentPage(),
        keyword: this.keyword() || undefined,
      })
      .subscribe({
        next: (res: any) => {
          const hostsList = res.data.data;
          this.hosts.set(hostsList);
          this.totalHosts.emit(hostsList.length);
          this.isLoading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(
            err?.error?.message || err.message || 'Failed to load hosts.'
          );
          this.isLoading.set(false);
        },
      });
  }
}
