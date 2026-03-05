import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-initialization',
  imports: [],
  templateUrl: './app-initialization.html',
  styleUrl: './app-initialization.scss',
})
export class AppInitialization implements OnInit, OnDestroy {
  progressWidth = 0;
  private progressInterval: any;

  ngOnInit() {
    this.startProgressAnimation();
  }

  ngOnDestroy() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private startProgressAnimation() {
    this.progressInterval = setInterval(() => {
      if (this.progressWidth < 60) {
        this.progressWidth += 1;
      } else {
        this.progressWidth = 0;
      }
    }, 50);
  }

  onDataCollectionClick() {
    console.log('Data collection info requested');
  }
}
