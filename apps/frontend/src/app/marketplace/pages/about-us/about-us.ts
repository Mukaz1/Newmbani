import { Component, inject } from '@angular/core';
import { MetaService } from '../../../common/services/meta.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-about-us',
  imports: [NgStyle],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {
  designBuildSteps = [
    {
      step: 1,
      title: 'Browse House Plans',
      description:
        'Explore our curated collection of architectural designs and floor plans.',
      icon: 'browse',
    },
    {
      step: 2,
      title: 'Purchase & Customize',
      description:
        'Buy your preferred plan or request custom modifications to suit your needs.',
      icon: 'customize',
    },
    {
      step: 3,
      title: 'Build Your Dream',
      description:
        'Connect with verified contractors and start building your perfect home.',
      icon: 'build',
    },
  ];
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'About Us',
            isClickable: false,
          },
        ],
      },
      title: 'About Us',
      description:
        'Learn more about the story, mission, and values behind Newmbani.',
    });
  }
}
