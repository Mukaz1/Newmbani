import { SubTopic } from '@newmbani/types';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppConstants } from '../../../common/constants';
import { HelpcenterService } from '../../../help-center/services/helpcenter.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  private helpcenterService = inject(HelpcenterService);

  app = AppConstants.appName;
  // year = new Date().getFullYear();
  year: number = new Date().getFullYear();
  footerSubtopics: SubTopic[] = [];

  // @Input({ required: true }) settings: Settings | undefined = undefined;

  ngOnInit(): void {
    this.loadFooterSubtopics();
  }

  loadFooterSubtopics(): void {
    this.helpcenterService
      .getSubTopics({
        limit: 3,
        page: 1,
      })
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.footerSubtopics = response.data.data.slice(0, 6);
          }
        },
        error: (error) => {
          console.error('Error loading footer subtopics:', error);
        },
      });
  }
}
