import { Component, inject, Input } from '@angular/core';
import { MetaService } from '../../../../../../common/services/meta.service';
import { Settings } from '@newmbani/types';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}
@Component({
  selector: 'app-faqs',
  imports: [],
  templateUrl: './faqs.html',
  styleUrl: './faqs.scss',
})
export class Faqs {
  activeComponent = 'faqs';
  openFaq: number | null = null;
  openSection: number | null = null;

  @Input({ required: true }) settings: Settings | undefined = undefined;

  private metaService = inject(MetaService);

  constructor() {
    this.metaService.setMeta({
      breadcrumb: {
        links: [
          {
            linkTitle: 'Faqs',
            isClickable: false,
          },
        ],
      },
      title: 'Faqs',
      description: 'Faqs',
    });
  }

  faqs: FAQ[] = [
    {
      id: 1,
      question: 'What is Aluxe BnBs?',
      answer:
        'Aluxe BnBs is a platform that connects guests with unique and verified vacation homes, short-stay rentals, and holiday experiences across Kenya.',
    },
    {
      id: 2,
      question: 'How do I make a booking?',
      answer:
        'Simply search for your preferred destination, choose your dates, select a property, and complete your booking directly through our secure platform.',
    },
    {
      id: 3,
      question: 'How do I contact the host?',
      answer:
        'After you confirm your booking, you will gain access to host contact details and can message them directly through the platform.',
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer:
        'We accept mobile money (M-Pesa), bank cards, and digital wallet payments depending on availability in your region.',
    },
    {
      id: 5,
      question: 'Can I cancel or modify my reservation?',
      answer:
        'Yes. Cancellation and modification options depend on the host’s policy. These will be displayed before confirming your booking.',
    },
    {
      id: 6,
      question: 'Is my personal information secure?',
      answer:
        'Absolutely. Your data is protected through modern encryption and privacy practices aligned with global security standards.',
    },
    {
      id: 7,
      question: 'How do check-in and check-out work?',
      answer:
        'Each property has clearly defined check-in and check-out instructions provided by your host, which will be available in your booking details.',
    },
    {
      id: 8,
      question: 'Who do I contact if there is an issue during my stay?',
      answer:
        'Please contact your host first for property-related issues. If you need further assistance, our support team is always available to help.',
    },
  ];

  setActiveComponent(id: string): void {
    this.activeComponent = id;
  }

  toggleFaq(id: number): void {
    this.openFaq = this.openFaq === id ? null : id;
  }

  toggleSection(id: number): void {
    this.openSection = this.openSection === id ? null : id;
  }

  isFaqOpen(id: number): boolean {
    return this.openFaq === id;
  }

  isSectionOpen(id: number): boolean {
    return this.openSection === id;
  }
}
