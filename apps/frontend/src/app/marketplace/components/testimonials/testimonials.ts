import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  currentIndex = 0;

  testimonials = [
    {
      name: 'Alex M.',
      title: 'First-Time Investor',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      quote:
        'As someone completely new to real estate investing, I was honestly nervous to start. But this platform made everything so simple. They guided me every step of the way and helped me feel confident in my decision.',
    },
    {
      name: 'Brian O.',
      title: 'Frequent Landlord',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      quote:
        'Listing with Newmbani was a turning point. I started getting bookings within a week. Their insights were sharp, and the support was top-notch!',
    },
    {
      name: 'Faith K.',
      title: 'Passive Income Seeker',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      quote:
        'I love how hands-off this has become. Newmbani handles the details while I enjoy the returns. It’s a win-win.',
    },
  ];

  prevTestimonial() {
    this.currentIndex =
      (this.currentIndex - 1 + this.testimonials.length) %
      this.testimonials.length;
  }

  nextTestimonial() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }
}
