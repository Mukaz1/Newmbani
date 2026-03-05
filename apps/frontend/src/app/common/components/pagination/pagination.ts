import { CdkMenuTrigger } from '@angular/cdk/menu';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatedData } from '@newmbani/types';

@Component({
  selector: 'app-pagination',
  imports: [FormsModule, CdkMenuTrigger],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination implements OnChanges {
  @Input({ required: true }) paginatedData: PaginatedData | undefined =
    undefined;
  @Input() itemsPerPage = 20;
  currentPage = 1;
  totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  pageSizeArray: { pageSize: number; name: string }[] = [
    { pageSize: 10, name: '10' },
    { pageSize: 20, name: '20' },
    { pageSize: 50, name: '50' },
    { pageSize: 100, name: '100' },
    { pageSize: 500, name: '500' },
    { pageSize: -1, name: 'All' },
  ];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginatedData']) {
      const data: PaginatedData = changes['paginatedData'].currentValue;
      this.itemsPerPage = data.limit;
      this.currentPage = data.page;
      this.totalPages = data.pages;
      this.paginatedData = data;
    }
    if (changes['itemsPerPage']) {
      const _pageSize: number = changes['itemsPerPage'].currentValue;
      //   check the page size that it exists in pageSizeArray
      const exists = this.pageSizeArray.some(
        ({ pageSize }) => pageSize === _pageSize
      );
      if (exists) {
        this.itemsPerPage = _pageSize;
        this.onItemsPerPageChange(this.itemsPerPage);
      }
    }
  }

  get invisiblePages(): (number | string)[] {
    if (!this.paginatedData) return [];
    const visiblePagesSet = new Set(this.visiblePages);
    const pages: (number | string)[] = [];
    for (let i = 1; i <= this.paginatedData.pages; i++) {
      if (!visiblePagesSet.has(i)) {
        pages.push(i);
      }
    }
    return pages;
  }
  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const totalVisiblePages = 7; // Total number of page buttons to show

    if ((this.paginatedData?.pages || 0) <= totalVisiblePages) {
      // Show all pages if total pages is less than visible pages
      return Array.from(
        { length: this.paginatedData?.pages || 0 },
        (_, i) => i + 1
      );
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end of visible pages
    let start = Math.max(2, (this.paginatedData?.page || 0) - 2);
    let end = Math.min(
      (this.paginatedData?.pages || 0) - 1,
      (this.paginatedData?.page || 0) + 2
    );

    // Adjust if current page is near the start
    if ((this.paginatedData?.page || 0) <= 4) {
      end = 5;
    }

    // Adjust if current page is near the end
    if (
      (this.paginatedData?.page || 0) >=
      (this.paginatedData?.pages || 0) - 3
    ) {
      start = (this.paginatedData?.pages || 0) - 4;
    }

    // Add ellipsis if needed at the start
    if (start > 2) {
      pages.push('...');
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed at the end
    if (end < (this.paginatedData?.pages || 0) - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(this.paginatedData?.pages || 0);

    return pages;
  }

  onPageChange(page: number | string): void {
    page = +page;
    if (
      page !== (this.paginatedData?.page || 0) &&
      page >= 1 &&
      page <= (this.paginatedData?.pages || 0)
    ) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPageChange.emit(items);
  }
}
