
import { Component, OnInit, input } from '@angular/core';

@Component({
  selector: 'app-stars',
  imports: [],
  templateUrl: './stars.html',
  styleUrl: './stars.scss'
})
export class StarsComponent implements OnInit {
  readonly stars = input.required<number>();
  readonly twoRow = input<boolean>(false);
  readonly styles = input<string>('');

  checked = 0;
  unchecked = 0;
  indeterminate = 0;
  indeterminatePercentage = 0;
  checkedStars: string[] = [];
  unCheckedStars: string[] = [];

  ngOnInit(): void {
    this.getStars();
  }
  getStars() {
    const checked = Math.floor(this.stars());
    const indeterminate = (this.stars() % 1) * 100;
    this.indeterminatePercentage = indeterminate;
    if (indeterminate > 0) {
      this.indeterminate = 1;
    } else {
      this.indeterminate = 0;
    }

    const unchecked = 5 - checked - this.indeterminate;
    this.unchecked = unchecked;

    for (let i = 0; i < checked; i++) {
      this.checkedStars.push('checked');
    }
    for (let i = 0; i < unchecked; i++) {
      this.unCheckedStars.push('unchecked');
    }

    return {
      checked,
      indeterminate,
      unchecked,
    };
  }
}
