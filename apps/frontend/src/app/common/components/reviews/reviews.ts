// import { Review, StarDistribution } from '@newmbani/types';
// import { Component, computed, input } from '@angular/core';

// @Component({
//   selector: 'app-reviews',
//   imports: [],
//   templateUrl: './reviews.html',
//   styleUrl: './reviews.scss',
// })
// export class Reviews {
//   // Input: array of reviews
//   reviews = input<Review[]>([]);

//   // Computed: Total number of reviews
//   totalReviews = computed(() => this.reviews().length);

//   // Computed: Average rating
//   averageRating = computed(() => {
//     const reviewList = this.reviews();
//     if (!reviewList.length) return 0;

//     const sum = reviewList.reduce((acc, review) => acc + review.rating, 0);
//     return parseFloat((sum / reviewList.length).toFixed(1));
//   });

//   // Computed: Count reviews by star rating
//   starCounts = computed(() => {
//     const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

//     for (const review of this.reviews()) {
//       counts[review.rating]++;
//     }

//     return counts;
//   });

//   // Computed: Star distribution with percentages for display
//   starDistribution = computed((): StarDistribution[] => {
//     const total = this.totalReviews() || 1; // Avoid division by 0
//     const counts = this.starCounts();

//     return [5, 4, 3, 2, 1].map((star) => ({
//       star,
//       count: counts[star],
//       percentage: (counts[star] / total) * 100,
//     }));
//   });

//   // Computed: Formatted star display (filled/unfilled)
//   starDisplay = computed(() => {
//     const avg = this.averageRating();
//     const fullStars = Math.floor(avg);
//     const hasHalfStar = avg % 1 >= 0.5;

//     return {
//       full: fullStars,
//       half: hasHalfStar ? 1 : 0,
//       empty: 5 - fullStars - (hasHalfStar ? 1 : 0),
//     };
//   });
// }
