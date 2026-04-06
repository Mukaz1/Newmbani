import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyImageCategory } from '@newmbani/types';
import { PropertyImagesService } from '../../services/property-image.service';
import { DataLoading } from '../../../../../common/components/data-loading/data-loading';
import { SearchInputWidget } from '../../../../../common/components/search-input-widget/search-input-widget';

@Component({
  selector: 'app-all-image-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, DataLoading, SearchInputWidget],
  templateUrl: './all-image-categories.html',
  styleUrls: ['./all-image-categories.scss'],
})
export class AllImageCategories implements OnInit {
  private service = inject(PropertyImagesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(false);
  categories = signal<PropertyImageCategory[]>([]);
  page = signal(1);
  limit = signal(10);
  total = signal(0);
  keyword = signal('');

  ngOnInit(): void {
    this.load();
  }

  load(page = this.page(), limit = this.limit()) {
    this.isLoading.set(true);
    this.service
      .getPropertyImageCategories({ page, limit, keyword: this.keyword() })
      .subscribe({
        next: (res) => {
          const data = (res?.data as any) || {};
          this.categories.set(data.data || []);
          this.total.set(data.total || 0);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSearch() {
    this.page.set(1);
    this.load();
  }

  updateKeyword(keyword: string) {
    this.keyword.set(keyword);
  }


  viewCategory(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

  editCategory(id: string) {
    this.router.navigate([id, 'edit'], { relativeTo: this.route });
  }

  createCategory() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  deleteCategory(id: string) {
    if (!confirm('Delete this category? This action cannot be undone.')) return;
    this.service.deletePropertyImageCategory(id).subscribe({
      next: () => this.load(),
      error: (err) => {
        console.error('Failed to delete category', err);
      },
    });
  }

  trackById(_i: number, item: PropertyImageCategory) {
    return item._id;
  }
}
