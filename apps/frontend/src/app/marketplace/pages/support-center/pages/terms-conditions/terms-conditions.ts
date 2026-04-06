import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface Definition {
  term: string;
  description: string;
}

interface PolicySection {
  id: string;
  title: string;
  content: string | string[];
  subsections?: {
    title?: string;
    items?: string[];
    note?: string;
  }[];
  highlights?: string[];
}

interface Responsibility {
  role: string;
  subtitle: string;
  items: string[];
  note?: string;
}

@Component({
  selector: 'app-terms-conditions',
  imports: [NgClass],
  templateUrl: './terms-conditions.html',
  styleUrl: './terms-conditions.scss',
})
export class TermsConditions {
  effectiveDate = '03/10/2025';
  companyName = 'Newmbani Ltd.';
  registeredOffice = 'Eldoret, Kenya';

  contactInfo = {
    email: 'Bookings.newmbani@gmail.com',
    phone: ['+254 701 663 066', '+254 720 220 801'],
    address: 'Eden Centre, Room F19, Eldoret, Kenya',
  };

  definitions: Definition[] = [
    {
      term: 'Newmbani / we / our',
      description: 'Newmbani Ltd.',
    },
    {
      term: 'Platform',
      description:
        "Newmbani's website, mobile applications, digital systems, and associated services.",
    },
    {
      term: 'User',
      description: 'Any individual or organization using the Platform.',
    },
    {
      term: 'Host',
      description: 'A User listing property or accommodation for booking.',
    },
    {
      term: 'Guest',
      description:
        'A User booking or purchasing accommodation or services through the Platform.',
    },
    {
      term: 'Service Provider',
      description:
        'Third-party providers offering services such as cleaning, concierge, transportation, photography, or related offerings.',
    },
    {
      term: 'Listing',
      description:
        'A property, accommodation, or service published on the Platform.',
    },
    {
      term: 'Content',
      description:
        'Photos, descriptions, reviews, posts, and other material submitted by Users.',
    },
  ];

  responsibilities: Responsibility[] = [
    {
      role: 'Host',
      subtitle: 'Host Responsibilities',
      items: [
        'Provide accurate, complete, and honest details about their property',
        'Upload photographs and media that represent the property truthfully',
        'Maintain the accommodation in safe, clean, and habitable condition',
        'Comply with all applicable laws regarding licensing, zoning, taxation, health, and safety',
        'Honour confirmed bookings except as allowed by a Host cancellation policy',
        'Respond promptly to Guests and address reasonable concerns',
      ],
      note: 'Hosts confirm they are legally authorized to offer the accommodation.',
    },
    {
      role: 'Guest',
      subtitle: 'Guest Responsibilities',
      items: [
        'Provide accurate details when booking',
        "Respect property rules, neighbors, and the Host's instructions",
        'Use the property responsibly and avoid causing damage',
        'Report issues promptly',
        'Take financial responsibility for any damages or violations arising during their stay',
      ],
    },
    {
      role: 'Service Provider',
      subtitle: 'Service Provider Responsibilities',
      items: [
        'Deliver services professionally and safely',
        'Possess any required licenses, insurance, or permits',
        'Take full responsibility for their conduct and outcomes',
        'Indemnify Newmbani from claims related to their services',
      ],
    },
  ];

  policySections: PolicySection[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content:
        'Welcome to Newmbani. By accessing or using the Newmbani platform, you agree to these Terms & Conditions, which govern your relationship with Newmbani Ltd. This document outlines how the platform operates, the responsibilities of each party, and the standards required to ensure a safe, transparent, and seamless experience for all Users, Hosts, Guests, and Service Providers.',
    },
    {
      id: 'nature',
      title: '3. Nature of the Platform',
      content:
        'The Platform functions as a digital marketplace that connects Guests with Hosts and Service Providers.',
      highlights: [
        'Newmbani does not own or manage the properties listed unless explicitly stated in writing.',
        'Hosts control their Listings, pricing, rules, and availability.',
        'Guests contract directly with Hosts or Service Providers when making a booking.',
        'Service Providers operate independently and are solely responsible for the services they deliver.',
        'Newmbani facilitates communication, discovery, and transactions but is not a party to individual accommodation or service agreements.',
      ],
    },
    {
      id: 'accounts',
      title: '4. User Accounts',
      content: 'To access the Platform, Users must:',
      subsections: [
        {
          items: [
            'Provide accurate and up-to-date registration information',
            'Be at least 18 years old or legally recognized as an adult',
            'Maintain security of their login credentials',
          ],
          note: 'Newmbani may suspend or terminate accounts that violate these Terms, compromise safety, or misuse the Platform.',
        },
      ],
    },
    {
      id: 'payments',
      title: '6. Payments, Fees & Taxes',
      content:
        'All payments for bookings and services are processed through the Newmbani Platform or as otherwise specified at checkout.',
      subsections: [
        {
          items: [
            'Payments may be processed through Newmbani or directly to Hosts or Service Providers.',
            'All applicable fees, commissions, or charges will be displayed prior to booking.',
            'Pricing may vary based on factors such as demand, season, or location.',
            'Guests agree to pay the total amount presented at checkout.',
            'Hosts and Service Providers are responsible for reporting and paying any applicable taxes, including income tax, VAT, or occupancy taxes.',
          ],
        },
      ],
    },
    {
      id: 'cancellations',
      title: '7. Cancellations, Modifications & Refunds',
      content: [
        'Cancellations, booking changes, and refunds are governed by the Newmbani Refund & Cancellation Policy.',
        'Refund eligibility depends on the cancellation policy assigned to the Listing.',
        'Refunds will only be issued where permitted under that policy or required by law.',
      ],
    },
    {
      id: 'acceptable-use',
      title: '8. Acceptable Use',
      content: 'Users agree not to:',
      subsections: [
        {
          items: [
            'Provide false, inaccurate, or misleading information',
            'Violate any laws or third-party rights',
            'Harass, harm, or discriminate against others',
            'Damage property or disrupt other Users',
            'Manipulate reviews, ratings, or Platform systems',
            "Circumvent fees or conduct off-platform transactions intended to avoid Newmbani's processes",
            'Upload content that is illegal, offensive, or harmful',
            "Interfere with the Platform's security or operations",
          ],
          note: 'Newmbani may remove content, restrict accounts, or take legal action if these Terms are violated.',
        },
      ],
    },
    {
      id: 'liability',
      title: '9. Limitation of Liability',
      content: 'To the maximum extent allowed by law:',
      subsections: [
        {
          items: [
            'Newmbani does not guarantee the accuracy, legality, safety, or condition of any Listing',
            'Newmbani is not responsible for actions, omissions, or conduct of Hosts, Guests, or Service Providers',
            'Newmbani is not liable for indirect, incidental, or consequential damages',
            "Newmbani's total liability is limited to the service fees paid by the User for the specific transaction giving rise to the claim",
          ],
          note: 'Users agree to indemnify and hold Newmbani harmless from claims arising from their actions or violations of these Terms.',
        },
      ],
    },
    {
      id: 'intellectual-property',
      title: '10. Intellectual Property',
      content: [
        'All technology, design, trademarks, branding, and materials on the Platform belong to Newmbani.',
        'Users may not reproduce, copy, distribute, or exploit Platform content without written consent.',
        'Users who upload Content grant Newmbani a global, royalty-free license to use, publish, and display that Content for operational and promotional purposes.',
      ],
    },
    {
      id: 'privacy',
      title: '11. Privacy & Data Handling',
      content: 'Newmbani handles personal data in accordance with:',
      subsections: [
        {
          items: [
            'The Kenya Data Protection Act (2019)',
            'Global data protection principles',
          ],
          note: 'Users consent to the collection, processing, and storage of their personal information as described in the Newmbani Privacy Policy.',
        },
      ],
    },
    {
      id: 'governing-law',
      title: '12. Governing Law & Dispute Resolution',
      content: [
        'These Terms are governed by the laws of Kenya.',
        'Disputes that cannot be resolved through direct communication will be referred to mediation or arbitration under the Chartered Institute of Arbitrators (Kenya Branch).',
        'For international Users, globally recognized dispute-resolution standards may be applied where appropriate.',
      ],
    },
    {
      id: 'additional',
      title: '13. Additional Provisions',
      content: '',
      subsections: [
        {
          items: [
            'These Terms, along with referenced policies, form the complete agreement between Users and Newmbani.',
            'If any provision is found invalid, the remainder stays in effect.',
            'Failure by Newmbani to enforce any right does not constitute a waiver.',
            'Newmbani is not responsible for delays caused by events beyond reasonable control, including natural events, strikes, or government actions.',
            'Users may not transfer rights or obligations under these Terms without prior written approval. Newmbani may assign its rights where necessary.',
          ],
        },
      ],
    },
  ];

  // Helper method to convert content to array
  asArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }
}
