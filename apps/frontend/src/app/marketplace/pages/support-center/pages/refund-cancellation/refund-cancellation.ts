import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface PolicySection {
  id: string;
  title: string;
  content?: string | string[];
  subsections?: {
    number?: string;
    title?: string;
    text: string;
  }[];
  note?: string;
}

interface CancellationTier {
  name: string;
  policy: string;
  badge: 'flexible' | 'moderate' | 'strict';
}

@Component({
  selector: 'app-refund-cancellation',
  imports: [NgClass],
  templateUrl: './refund-cancellation.html',
  styleUrl: './refund-cancellation.scss',
})
export class RefundCancellation {
  effectiveDate = '03/10/2025';
  companyName = 'Newmbani Ltd.';
  registeredOffice = 'Eldoret, Kenya';

  accommodationTiers: CancellationTier[] = [
    {
      name: 'Flexible',
      policy:
        'Full refund if cancellation is made at least 48 hours before check-in, excluding non-refundable service fees.',
      badge: 'flexible',
    },
    {
      name: 'Moderate',
      policy:
        '50% refund if cancellation is made at least 7 days before check-in.',
      badge: 'moderate',
    },
    {
      name: 'Strict',
      policy:
        'Cancellations made less than 14 days before check-in are non-refundable.',
      badge: 'strict',
    },
  ];

  policySections: PolicySection[] = [
    {
      id: 'general',
      title: '1. General Provisions',
      content:
        'This Refund & Cancellation Policy ("Policy") outlines the terms and conditions for refunds and cancellations for bookings and services made through the Newmbani Platform.',
      subsections: [
        {
          number: '1.1',
          text: 'This Refund & Cancellation Policy applies to all bookings and services made through the Newmbani Platform.',
        },
        {
          number: '1.2',
          text: 'By making a booking or purchasing services, Users, Hosts, and Service Providers agree to be bound by this Policy.',
        },
        {
          number: '1.3',
          text: 'This Policy forms part of the contractual framework between Users and Newmbani Ltd.',
        },
      ],
    },
    {
      id: 'concierge',
      title: '3. Concierge & Lifestyle Services',
      content:
        'These include services such as personal chef, salon, massage, transport, personal shopping, and related offerings.',
      subsections: [
        {
          number: '3.1',
          text: 'Guests may cancel at least 24 hours before the scheduled service time for a refund.',
        },
        {
          number: '3.2',
          text: 'Cancellations made within 24 hours of the scheduled service are non-refundable.',
        },
      ],
    },
    {
      id: 'cleaning',
      title: '4. Cleaning & Moving Services',
      content: 'These include cleaning, laundry, moving, and related services.',
      subsections: [
        {
          number: '4.1',
          text: 'Cancellations made at least 24 hours before the scheduled service time qualify for a refund.',
        },
        {
          number: '4.2',
          text: 'Cancellations made within 24 hours are non-refundable.',
        },
      ],
    },
    {
      id: 'design',
      title: '5. Design, Furnishing & Build Services',
      content: '(For Newmbani-certified contractors and service providers.)',
      subsections: [
        {
          number: '5.1',
          text: 'Project deposits become non-refundable once work has begun.',
        },
        {
          number: '5.2',
          text: 'Progress or stage payments are non-refundable unless the contractor fails to deliver the agreed milestone.',
        },
        {
          number: '5.3',
          text: "If a project is cancelled before work begins, refunds may be issued at Newmbani's discretion, minus administrative or processing fees.",
        },
      ],
    },
    {
      id: 'host-cancellations',
      title: '6. Cancellations by Hosts or Service Providers',
      content:
        'In the event a Host or Service Provider cancels a confirmed booking or service:',
      subsections: [
        {
          number: '6.1',
          text: 'If a Host or Service Provider cancels a confirmed booking, the Guest is entitled to a full refund, including applicable service fees.',
        },
        {
          number: '6.2',
          text: 'Repeated cancellations may result in suspension or permanent removal from the Platform.',
        },
      ],
    },
    {
      id: 'no-shows',
      title: '7. No-Shows',
      content:
        'Guests who do not show up for their booking or scheduled service without prior cancellation:',
      subsections: [
        {
          number: '7.1',
          text: 'Guests who fail to appear for a booking or scheduled service without cancelling are not entitled to a refund.',
        },
      ],
    },
    {
      id: 'refund-processing',
      title: '8. Refund Processing',
      content: 'Once a refund is approved, the following terms apply:',
      subsections: [
        {
          number: '8.1',
          text: 'Refunds are issued to the original payment method.',
        },
        {
          number: '8.2',
          text: 'Processing may take up to fourteen (14) business days, depending on payment channels.',
        },
        {
          number: '8.3',
          text: 'Newmbani is not responsible for delays caused by banks, mobile money providers, or other payment processors.',
        },
      ],
    },
    {
      id: 'exceptional',
      title: '9. Exceptional Circumstances',
      content:
        'Newmbani may, at its discretion, grant refunds outside the standard policy when supported by verifiable evidence. Exceptional circumstances include:',
      subsections: [
        {
          number: '9.1',
          text: 'Serious medical emergencies affecting the Guest or an immediate family member.',
        },
        {
          number: '9.2',
          text: 'Natural disasters, major travel disruptions, or government-imposed restrictions.',
        },
        {
          number: '9.3',
          text: 'Property found unsafe or uninhabitable upon arrival, as verified by Newmbani.',
        },
      ],
      note: 'All decisions under this clause are at the sole discretion of Newmbani Ltd.',
    },
    {
      id: 'non-refundable',
      title: '10. Non-Refundable Fees',
      content: '',
      subsections: [
        {
          number: '10.1',
          text: 'Platform service fees, administrative charges, and applicable taxes are non-refundable, unless the cancellation is initiated by a Host or Service Provider.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: '11. Governing Law & Dispute Resolution',
      content: '',
      subsections: [
        {
          number: '11.1',
          text: 'This Policy is governed by the Laws of Kenya.',
        },
        {
          number: '11.2',
          text: 'Disputes shall first be addressed through amicable communication.',
        },
        {
          number: '11.3',
          text: 'If unresolved, disputes shall proceed to mediation or arbitration under the Chartered Institute of Arbitrators (Kenya Branch).',
        },
      ],
    },
    {
      id: 'miscellaneous',
      title: '12. Miscellaneous',
      content: '',
      subsections: [
        {
          number: '12.1',
          title: 'Entire Agreement',
          text: 'This Policy forms part of the binding agreement between Users and Newmbani alongside the Terms & Conditions.',
        },
        {
          number: '12.2',
          title: 'Severability',
          text: 'If any provision is found invalid, the remaining sections continue in full force.',
        },
        {
          number: '12.3',
          title: 'Force Majeure',
          text: 'Newmbani is not liable for delays caused by events outside its control, including system outages, payment processor failures, strikes, or government restrictions.',
        },
      ],
    },
  ];

  // Helper method to convert content to array
  asArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }

  getBadgeClass(badge: string): string {
    const classes = {
      flexible: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      strict: 'bg-red-100 text-red-800',
    };
    return (
      classes[badge as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
  }
}
