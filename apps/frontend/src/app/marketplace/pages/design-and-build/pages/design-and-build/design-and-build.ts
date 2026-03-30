import { Component, inject } from '@angular/core';
import { MetaService } from '../../../../../common/services/meta.service';

@Component({
  selector: 'app-design-and-build',
  imports: [],
  templateUrl: './design-and-build.html',
  styleUrl: './design-and-build.scss',
})
export class DesignAndBuild {
  private readonly metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Design & Build',
            isClickable: false,
          },
        ],
      },
      title: 'Design & Build',
      description:
        'Discover architectural plans, modify designs, or start a full custom project for your dream home.',
    });
  }
  plans = [
    {
      icon: 'bx bx-home',
      title: 'Browse & Buy Plans',
      description:
        'Explore our curated catalog of ready-to-build architectural plans and download them instantly.',
      price: '$500',
      color: 'indigo',
      points: [
        'Instant digital delivery',
        'Ready for permits',
        'Most affordable option',
      ],
    },
    {
      icon: 'bx bx-edit',
      title: 'Modify Existing Plans',
      description:
        'Start with a design you like and tailor it to your needs — resize rooms, adjust layouts, and more.',
      price: '$1,500',
      color: 'purple',
      points: [
        'Professional modifications',
        'Faster than full custom',
        'Tailored to your lot',
      ],
    },
    {
      icon: 'bx bx-paint',
      title: 'Full Custom Design',
      description:
        'Collaborate with expert architects to create a one-of-a-kind home designed just for you.',
      price: '$5,000',
      color: 'orange',
      points: [
        'Fully bespoke design',
        'Direct architect collaboration',
        'One-of-a-kind home',
      ],
    },
  ];

  docs = [
    {
      icon: 'bx bx-grid-alt',
      title: 'Floor Plans',
      text: 'Detailed layouts for all levels with dimensions',
    },
    {
      icon: 'bx bx-building',
      title: 'Elevations',
      text: 'Exterior views from all sides with materials',
    },
    {
      icon: 'bx bx-bulb',
      title: 'Electrical',
      text: 'Complete outlet, switch, and fixture plans',
    },
    {
      icon: 'bx bx-list-check',
      title: 'Specifications',
      text: 'Construction notes and material lists',
    },
    {
      icon: 'bx bx-layer',
      title: 'Foundation',
      text: 'Structural foundation and footing details',
    },
    {
      icon: 'bx bx-ruler',
      title: 'Sections',
      text: 'Cross-sections showing height and structure',
    },
    {
      icon: 'bx bx-wind',
      title: 'Roof Plans',
      text: 'Roof slopes, framing, and materials',
    },
    {
      icon: 'bx bx-file',
      title: 'Schedules',
      text: 'Windows, doors, and finishes schedules',
    },
  ];
}
