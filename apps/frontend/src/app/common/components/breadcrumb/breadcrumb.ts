import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from '../../services/breadcrumb.service';

export interface Breadcrumb {
  links: { linkTitle: string; link?: string; isClickable: boolean }[];
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss'],
  imports: [RouterLink, RouterLinkActive],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumb: Breadcrumb | undefined | null;
  destroy$ = new Subject();

  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.breadcrumbService.breadcrumb$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (breadcrumb: Breadcrumb | null) => {
          this.breadcrumb = breadcrumb;
          this.changeDetectorRef.detectChanges();
        },
      });
  }
}
