
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-integrations',
  imports: [],
  templateUrl: './integrations.html',
  styleUrl: './integrations.scss',
})
export class Integrations implements OnInit {
  services = [
    {
      icon: 'house',
      title: 'Property Listing & Management',
      description:
        'Effortlessly list your properties and manage bookings with our intuitive platform, reaching a broad customer base.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'left',
    },
    {
      icon: 'handshake',
      title: 'Exclusive Service Partnerships',
      description:
        'Partner with frontend to offer your services directly to guests, expanding your business reach and streamlining bookings.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'center',
    },
    {
      icon: 'calendar',
      title: 'Seamless Property Booking',
      description:
        'Browse and book verified BNBs with ease, ensuring a comfortable and secure stay every time.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'right',
    },
    {
      icon: 'tools',
      title: 'Integrated Service Booking',
      description:
        'Book various services like transport, beauty, and wellness directly through the platform for a complete experience.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'left',
    },
    {
      icon: 'blueprint',
      title: 'Curated House Plans',
      description:
        'Browse a collection of high-quality architectural designs and purchase plans directly from verified designers.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'center',
    },
    {
      icon: 'pencil',
      title: 'Custom Design Requests',
      description:
        'Request bespoke architectural plans tailored to your specific needs from our network of verified designers.',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      position: 'right',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.initializeAnimations();
  }

  getIcon(iconName: string): string {
    const icons: { [key: string]: string } = {
      house: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
        </path>
      </svg>`,
      handshake: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
        </path>
      </svg>`,
      calendar: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
        </path>
      </svg>`,
      tools: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
        </path>
      </svg>`,
      blueprint: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2m8 0V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2z">
        </path>
      </svg>`,
      pencil: `<svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
        </path>
      </svg>`,
    };
    return icons[iconName] || icons['house'];
  }

  private initializeAnimations(): void {
    // Initialize intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    });

    // Observe all service cards
    setTimeout(() => {
      const cards = document.querySelectorAll('.service-card');
      cards.forEach((card) => observer.observe(card));
    }, 100);
  }

  landlordFeatures = [
    {
      icon: 'verify',
      title: 'Quick Verification Process',
      description:
        'Get verified by our backoffice team through a streamlined process ensuring trust and credibility.',
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: 'property',
      title: 'Property Management Hub',
      description:
        'List and manage multiple properties with automated verification, pricing tools, and booking management.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: 'analytics',
      title: 'Performance Analytics',
      description:
        'Track bookings, revenue, and properties performance with detailed insights and reporting tools.',
      gradient: 'from-pink-500 to-red-500',
    },
    {
      icon: 'support',
      title: 'Dedicated Support',
      description:
        "Access priority support and resources to maximize your properties's potential and guest satisfaction.",
      gradient: 'from-blue-500 to-teal-500',
    },
  ];

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

  getGradientColors(gradient: string): string {
    const gradientMap: { [key: string]: string } = {
      'from-blue-500 to-purple-600': '#3b82f6, #9333ea',
      'from-green-500 to-blue-500': '#10b981, #3b82f6',
      'from-purple-500 to-pink-500': '#8b5cf6, #ec4899',
      'from-orange-500 to-red-500': '#f97316, #ef4444',
      'from-teal-500 to-green-500': '#14b8a6, #10b981',
      'from-indigo-500 to-purple-500': '#6366f1, #8b5cf6',
      'from-pink-500 to-red-500': '#ec4899, #ef4444',
      'from-blue-500 to-teal-500': '#3b82f6, #14b8a6',
    };
    return gradientMap[gradient] || '#3b82f6, #9333ea';
  }
}
