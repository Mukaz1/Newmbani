
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  imports: [],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss'
})
export class RatingStars {
  readonly stars = input.required<number>();
  @Input({ required: true }) reviews = 0;
  readonly twoRow = input<boolean>(false);
  readonly styles = input<string>('');

  
}
