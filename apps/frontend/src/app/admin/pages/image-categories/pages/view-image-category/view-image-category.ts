import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PropertyImageCategory } from '@newmbani/types';
import { PropertyImagesService } from '../../services/property-image.service';

@Component({
  selector: 'app-view-image-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-image-category.html',
  styleUrls: ['./view-image-category.scss'],
})
export class ViewImageCategory implements OnInit {
  categoryId: string | null = null;
  category: PropertyImageCategory | null = null;
  isLoading = true;

  private readonly service = inject(PropertyImagesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.load(this.categoryId);
    }
  }

  load(id: string) {
    this.isLoading = true;
    this.service
      .getPropertyImageCategoryById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.category = res?.data as PropertyImageCategory;
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load category', err);
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  goBack() {
    this.router.navigate(['/admin/image-categories'], { relativeTo: this.route });
  }
}
