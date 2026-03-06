import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AluxeServicesService } from '../../../properties/services/aluxe-services.service';
import { AluxeServiceInterface } from '@newmbani/types';

interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  howItWorks: string;
  benefits: string[];
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {
  aluxeServices: AluxeServiceInterface[] = [];
  services: Service[] = [];
  selectedService: Service | null = null;
  loading = true;

  private aluxeServicesService = inject(AluxeServicesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit() {
    this.getAllServices();
    this.initializeLocalServices();
  }

  getAllServices(): void {
    this.aluxeServicesService
      .getServices()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (services) => {
          this.aluxeServices = services;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading services:', err);
          this.loading = false;
        },
      });
  }

  goToServiceDetails(id: string) {
    this.router.navigate(['/aluxe', id]);
  }

  openModal(service: Service): void {
    this.selectedService = service;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedService = null;
    document.body.style.overflow = 'auto';
  }

  initializeLocalServices(): void {
    this.services = [
      {
        id: 'airport',
        title: 'Airport Transfers',
        icon: 'bxs-plane-alt',
        description:
          'Professional airport pickup and drop-off services that make your journey seamless from start to finish.',
        features: [
          'Flight tracking for real-time pickup coordination',
          'Meet and greet at arrivals with name sign',
          'Professional, vetted drivers',
          'Premium vehicles with luggage space',
          'Fixed pricing with no hidden fees',
        ],
        howItWorks:
          "Provide your flight details when booking your stay. We'll monitor flight status and ensure a timely pickup. Your driver will assist with luggage and drive you to your accommodation.",
        benefits: [
          'No waiting lines or last-minute calls',
          'Guaranteed pickup despite delays',
          'Personalized, comfortable service',
        ],
      },
      {
        id: 'drivers',
        title: 'Private Drivers',
        icon: 'bxs-car',
        description:
          'Your personal driver for the duration of your stay — offering flexibility, safety, and local insight.',
        features: [
          'Daily or hourly hire options',
          'Experienced, local drivers',
          'Flexible multi-stop planning',
          'Clean, air-conditioned vehicles',
        ],
        howItWorks:
          'Book your preferred time and duration when reserving your stay. Your driver coordinates with you to plan routes and timing.',
        benefits: [
          'Explore without navigation stress',
          'No parking hassles',
          'Reliable, punctual transfers',
        ],
      },
      {
        id: 'chef',
        title: 'Private Chef',
        icon: 'bxs-bowl-hot',
        description:
          'Enjoy restaurant-quality dining in your accommodation with chefs who bring creativity and skill to your kitchen.',
        features: [
          'Custom menus tailored to taste',
          'All dietary preferences respected',
          'Premium, locally sourced ingredients',
          'Full cleanup after service',
        ],
        howItWorks:
          'Submit your meal preferences and schedule. The chef shops, cooks, serves, and tidies — leaving you free to enjoy.',
        benefits: [
          'Perfect for celebrations or cozy nights',
          'Private fine-dining atmosphere',
          'Effortless from prep to cleanup',
        ],
      },
      {
        id: 'meals',
        title: 'Meal Services',
        icon: 'bxs-wine',
        description:
          'From fresh breakfasts to pre-stocked groceries, we take care of every culinary convenience.',
        features: [
          'Pre-arrival grocery stocking',
          'Breakfast or dinner deliveries',
          'Local delicacy recommendations',
        ],
        howItWorks:
          'Send your grocery list or choose from preset menus. We source locally and deliver directly to your accommodation.',
        benefits: [
          'Arrive to a ready kitchen',
          'No shopping trips needed',
          'Fresh, quality ingredients always',
        ],
      },
      {
        id: 'wellness',
        title: 'Spa & Wellness',
        icon: 'bxs-leaf',
        description:
          'Certified therapists and instructors bring wellness directly to your door — relaxation without travel.',
        features: [
          'Massage and therapy sessions',
          'Yoga or meditation classes',
          'All materials and products provided',
        ],
        howItWorks:
          'Select a time and service; our professionals arrive with equipment and create a serene in-home experience.',
        benefits: [
          'Private and tranquil setting',
          'Licensed wellness experts',
          'Tailored to your preferences',
        ],
      },
      {
        id: 'Comfort & Maintenance',
        title: 'Comfort & Maintenance',
        icon: 'bxs-spray-can',
        description:
          'Keep your stay spotless with flexible mid-stay cleaning and linen services for comfort that lasts.',
        features: [
          'Mid-stay or daily cleaning',
          'Laundry pickup and return',
          'Eco-friendly cleaning products',
        ],
        howItWorks:
          'Request cleaning when needed or schedule recurring services — discreet, professional, and efficient.',
        benefits: [
          'Stay fresh throughout your trip',
          'Respectful, punctual staff',
          'Sustainable cleaning approach',
        ],
      },
    ];
  }
}
