import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AluxeServicesService } from '../../../properties/services/newmbani-services.service';
import { AluxeServiceInterface } from '@newmbani/types';

@Component({
  selector: 'app-service-details',
  imports: [],
  templateUrl: './service-details.html',
  styleUrl: './service-details.scss',
})
export class ServiceDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private aluxeServicesService = inject(AluxeServicesService);

  serviceType = 'cleaning'; // Default, can be set dynamically
  service?: AluxeServiceInterface;

  goBack() {
    window.history.back();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.getServiceById(id);
    }
  }

  getServiceById(id: string): void {
    this.aluxeServicesService
      .getServiceById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (service) => {
          this.service = service;
        },
        error: (err) => {
          console.error('Error loading service by id', err);
        },
      });
  }
}
