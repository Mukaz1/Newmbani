import { Component } from '@angular/core';

interface PolicySection {
  id: string;
  title: string;
  content: string | string[];
  subsections?: {
    letter: string;
    text: string;
  }[];
}

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  effectiveDate = '03/10/2025';
  companyName = 'Aluxe Ltd.';
  registeredOffice = 'Eldoret, Kenya';

  contactInfo = {
    email: 'Bookings.aluxe@gmail.com',
    phone: ['+254 701 663 066', '+254 720 220 801'],
    address: 'Eden Centre, Room F19, Eldoret, Kenya',
  };

  policySections: PolicySection[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: [
        'This Privacy Policy explains how Aluxe Ltd. ("Aluxe") collects, uses, stores, and protects personal data in compliance with the Kenya Data Protection Act, 2019, and recognized international data protection principles.',
        'By using the Aluxe Platform, Users consent to the practices described in this Policy.',
      ],
    },
    {
      id: 'data-collection',
      title: '2. Data We Collect',
      content: 'Aluxe may collect the following categories of personal data:',
      subsections: [
        {
          letter: 'a',
          text: 'Identification details: name, phone number, email address, identification/passport details.',
        },
        {
          letter: 'b',
          text: 'Account information: login credentials, preferences, profile details.',
        },
        {
          letter: 'c',
          text: 'Payment & transaction data: payment methods, mobile money details, transaction receipts, booking history.',
        },
        {
          letter: 'd',
          text: 'Property or service-related information: details provided when listing or booking accommodation or services.',
        },
        {
          letter: 'e',
          text: 'Technical data: IP address, device identifiers, cookies, browser type, usage analytics.',
        },
      ],
    },
    {
      id: 'data-usage',
      title: '3. How We Use Personal Data',
      content: 'Aluxe uses personal data for the following purposes:',
      subsections: [
        {
          letter: 'a',
          text: 'Delivering Platform services including bookings, accommodation, and lifestyle services.',
        },
        {
          letter: 'b',
          text: 'Processing payments, refunds, and meeting financial compliance requirements.',
        },
        {
          letter: 'c',
          text: 'User authentication, fraud prevention, and platform security.',
        },
        {
          letter: 'd',
          text: 'Communicating with Users regarding bookings, account updates, and notifications.',
        },
        {
          letter: 'e',
          text: 'Marketing, promotional messaging (where consented), and service improvements.',
        },
        {
          letter: 'f',
          text: 'Compliance with legal, tax, and regulatory obligations.',
        },
      ],
    },
    {
      id: 'data-sharing',
      title: '4. Sharing of Personal Data',
      content: 'Aluxe may share personal data with:',
      subsections: [
        {
          letter: 'a',
          text: 'Hosts and Service Providers to facilitate bookings and service delivery.',
        },
        {
          letter: 'b',
          text: 'Payment processors and mobile money providers to complete financial transactions.',
        },
        {
          letter: 'c',
          text: 'Regulators, courts, or government agencies as required by law.',
        },
        {
          letter: 'd',
          text: 'Operational partners supporting customer service, communication, analytics, and technical infrastructure.',
        },
      ],
    },
    {
      id: 'international-transfers',
      title: '5. International Data Transfers',
      content: [
        'For Users located outside Kenya, personal data may be transferred to or stored in other countries.',
        'Aluxe ensures such transfers comply with the Kenya Data Protection Act, 2019, and that adequate safeguards are in place to protect User information.',
      ],
    },
    {
      id: 'data-security',
      title: '6. Data Security',
      content: [
        'Aluxe implements appropriate technical and organizational measures to protect personal data from unauthorized access, alteration, or disclosure.',
        'Users acknowledge that no digital platform can guarantee absolute security, and data is shared at their own risk.',
      ],
    },
    {
      id: 'data-retention',
      title: '7. Data Retention',
      content: [
        'Aluxe retains personal data for as long as necessary to fulfil contractual, operational, and legal obligations.',
        'When data is no longer needed, it will be securely deleted, anonymized, or archived in accordance with legal requirements.',
      ],
    },
    {
      id: 'cookies',
      title: '8. Cookies & Tracking Technologies',
      content: [
        'The Platform uses cookies and similar tools to improve functionality, personalize the user experience, and analyze platform performance.',
        'Users may disable cookies in browser settings, although certain features may be restricted as a result.',
      ],
    },
    {
      id: 'user-rights',
      title: '9. User Rights',
      content:
        'Under the Kenya Data Protection Act, 2019, Users have the right to:',
      subsections: [
        {
          letter: 'a',
          text: 'Access their personal data.',
        },
        {
          letter: 'b',
          text: 'Request correction or deletion of inaccurate or outdated data.',
        },
        {
          letter: 'c',
          text: 'Restrict or object to certain data processing activities.',
        },
        {
          letter: 'd',
          text: 'Withdraw consent at any time, where processing is based on consent.',
        },
        {
          letter: 'e',
          text: 'Lodge complaints with the Office of the Data Protection Commissioner (ODPC).',
        },
      ],
    },
    {
      id: 'children',
      title: "10. Children's Data",
      content: [
        'The Aluxe Platform is not intended for individuals under 18 years of age.',
        'Aluxe does not knowingly collect personal data from minors. If such data is identified, it will be deleted promptly.',
      ],
    },
    {
      id: 'amendments',
      title: '11. Amendments to This Policy',
      content: [
        'Aluxe may update or modify this Privacy Policy at any time.',
        'Changes will be posted on the Platform, and continued use constitutes acceptance of the updated Policy.',
      ],
    },
    {
      id: 'governing-law',
      title: '12. Governing Law & Dispute Resolution',
      content: [
        'This Privacy Policy is governed by the Laws of Kenya.',
        'Disputes will be addressed first through amicable resolution, followed by mediation or arbitration under the Chartered Institute of Arbitrators (Kenya Branch), and if necessary, adjudication by the courts of Eldoret, Kenya.',
      ],
    },
  ];

  // Helper method to check if content is an array
  isArray(value: any): value is string[] {
    return Array.isArray(value);
  }

  // Helper method to get content as array
  asArray(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }

  // @Input({ required: true }) settings: Settings | undefined = undefined;
}
