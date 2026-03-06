import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HelpcenterService } from '../../../help-center/services/helpcenter.service';
import { Faqs } from './pages/group/faqs/faqs';
import { HostsTerms } from './pages/hosts-terms/hosts-terms';
import { Topic, SubTopic, FAQs, Settings } from '@newmbani/types';
import { AboutUs } from '../about-us/about-us';
import { PrivacyPolicy } from './pages/privacy-policy/privacy-policy';
import { PaymentTerms } from './pages/payment-terms/payment-terms';
import { ThirdPartyOrdersTerms } from './pages/third-party-orders-terms/third-party-orders-terms';
import { RefundCancellation } from './pages/refund-cancellation/refund-cancellation';
import { TermsConditions } from './pages/terms-conditions/terms-conditions';

@Component({
  selector: 'app-helpcenter',
  imports: [
    FormsModule,
    Faqs,
    PaymentTerms,
    HostsTerms,
    AboutUs,
    ThirdPartyOrdersTerms,
    PrivacyPolicy,
    RefundCancellation,
    TermsConditions,
  ],
  templateUrl: './helpcenter.html',
  styleUrls: ['./helpcenter.scss'],
})
export class HelpCenter implements OnInit {
  private helpcenterService = inject(HelpcenterService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  defaultIcon = 'assets/images/logos/logo-orange.svg';

  topics: Topic[] = [];
  filteredTopics: Topic[] = [];
  selectedTopic: Topic | null = null;
  selectedSubTopic: SubTopic | null = null;
  searchQuery = '';
  loading = false;
  error = '';
  openFaqId: string | null = null;

  settings: Settings | undefined = undefined;

  // Current page/component to render
  currentPage = 'topics'; // 'topics' | 'faqs' | 'buyers' | etc.

  // Pagination
  currentPageNum = 1;
  limit = 10;
  totalPages = 1;

  // Sidebar menu items
  menuItems = [
    { path: 'faqs', label: 'FAQs', icon: '❓' },
    { path: 'hosts', label: 'Hosts', icon: '🏪' },
    { path: 'payment', label: 'Payment Terms', icon: '💳' },
    { path: 'terms-conditions', label: 'Terms & Conditions', icon: '📜' },
    { path: 'refund-cancellation', label: 'Refund & Cancellation', icon: '💸' },
    { path: 'third-party', label: 'Third Party Services', icon: '🤝' },
    { path: 'about', label: 'About Us', icon: 'ℹ️' },
    { path: 'privacy-policy', label: 'Privacy Policy', icon: '🔒' },
  ];

  ngOnInit(): void {
    // First load all topics
    this.loadTopics(() => {
      // After topics are loaded, handle route changes
      this.route.url.subscribe((urlSegments) => {
        const path = urlSegments[0]?.path;

        // Check if it's a special page route
        const specialPages = [
          'faqs',
          'hosts',
          'payment',
          'refund-cancellation',
          'terms-conditions',
          'third-party',
          'about',
          'privacy-policy',
        ];

        if (specialPages.includes(path)) {
          this.currentPage = path;
          this.selectedTopic = null;
          this.selectedSubTopic = null;
        } else {
          this.currentPage = 'topics';
          // Handle topic/subtopic routing
          this.handleTopicRouting();
        }
      });
    });
  }

  handleTopicRouting(): void {
    this.route.params.subscribe((params) => {
      const topicSlug = params['topicSlug'];
      const subtopicSlug = params['subtopicSlug'];

      if (topicSlug) {
        const foundTopic = this.topics.find((t) => t.slug === topicSlug);

        if (foundTopic) {
          this.selectedTopic = foundTopic;

          if (subtopicSlug && foundTopic.subTopics) {
            const foundSubTopic = foundTopic.subTopics.find(
              (st) => st.slug === subtopicSlug
            );

            if (foundSubTopic) {
              this.loadSubTopicBySlug(subtopicSlug);
            } else {
              this.selectedSubTopic = null;
            }
          } else {
            this.selectedSubTopic = null;
          }
        } else {
          this.loadTopicBySlug(topicSlug, subtopicSlug);
        }
      } else {
        this.selectedTopic = null;
        this.selectedSubTopic = null;
      }
    });
  }

  navigateToPage(path: string): void {
    this.router.navigate(['/support-center', path]);
  }

  loadTopics(callback?: () => void): void {
    if (this.topics.length > 0 && !callback) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.helpcenterService
      .getAllTopics({
        page: this.currentPageNum,
        limit: -1,
        keyword: this.searchQuery,
      })
      .subscribe({
        next: (response) => {
          if (response.statusCode === 200 && response.data) {
            this.topics = response.data.data;
            this.filteredTopics = [...this.topics];
            this.totalPages = response.data.pages;
          }
          this.loading = false;

          if (callback) {
            callback();
          }
        },
        error: (error) => {
          this.error = 'Failed to load topics';
          this.loading = false;
          console.error('Error loading topics:', error);
        },
      });
  }

  loadTopicBySlug(topicSlug: string, subtopicSlug?: string): void {
    this.loading = true;
    this.helpcenterService.getTopicById(topicSlug).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.selectedTopic = response.data;

          const index = this.topics.findIndex((t) => t.slug === topicSlug);
          if (index !== -1) {
            this.topics[index] = response.data;
            this.filteredTopics = [...this.topics];
          }

          if (subtopicSlug) {
            this.loadSubTopicBySlug(subtopicSlug);
          } else {
            this.selectedSubTopic = null;
            this.loading = false;
          }
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error loading topic:', error);
        this.error = 'Failed to load topic details';
        this.loading = false;
      },
    });
  }

  loadSubTopicBySlug(slug: string): void {
    this.loading = true;
    this.helpcenterService.getSubTopicById(slug).subscribe({
      next: (response) => {
        if (response.statusCode === 200 && response.data) {
          this.selectedSubTopic = response.data;

          if (!this.selectedTopic && response.data.topicId) {
            const parentTopic = this.topics.find(
              (t) => t._id === response.data?.topicId
            );
            if (parentTopic) {
              this.selectedTopic = parentTopic;
            } else {
              this.loadTopicBySlug(response.data.topicId);
            }
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subtopic:', error);
        this.error = 'Failed to load subtopic details';
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredTopics = this.topics.filter(
        (topic) =>
          topic.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          topic.description
            ?.toLowerCase()
            .includes(this.searchQuery.toLowerCase()) ||
          topic.subTopics?.some(
            (st) =>
              st.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              st.description
                ?.toLowerCase()
                .includes(this.searchQuery.toLowerCase())
          )
      );
    } else {
      this.filteredTopics = [...this.topics];
    }

    this.selectedTopic = null;
    this.selectedSubTopic = null;
    this.currentPage = 'topics';
    this.router.navigate(['/support-center']);
  }

  selectTopic(topic: Topic): void {
    this.selectedTopic = topic;
    this.selectedSubTopic = null;
    this.currentPage = 'topics';
    this.router.navigate(['/support-center/topic', topic.slug]);
  }

  selectSubTopic(subtopic: SubTopic): void {
    this.selectedSubTopic = subtopic;
    if (this.selectedTopic?.slug) {
      this.router.navigate([
        '/support-center/topic',
        this.selectedTopic.slug,
        'subtopic',
        subtopic.slug,
      ]);
    }
  }

  goBack(): void {
    if (this.selectedSubTopic && this.selectedTopic) {
      this.selectedSubTopic = null;
      this.router.navigate(['/support-center/topic', this.selectedTopic.slug]);
    } else if (this.selectedTopic) {
      this.selectedTopic = null;
      this.router.navigate(['/support-center']);
    }
  }

  showAllTopics(): void {
    this.selectedTopic = null;
    this.selectedSubTopic = null;
    this.currentPage = 'topics';
    this.router.navigate(['/support-center']);
  }

  toggleFaq(faqId: string): void {
    this.openFaqId = this.openFaqId === faqId ? null : faqId;
  }

  isFaqOpen(faqId: string): boolean {
    return this.openFaqId === faqId;
  }

  markFaqHelpful(faq: FAQs): void {
    if (!faq._id) return;

    this.helpcenterService.markFaqAsHelpful(faq._id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          faq.helpfulCount++;
        }
      },
      error: (error) => {
        console.error('Error marking FAQ as helpful:', error);
      },
    });
  }

  markFaqNotHelpful(faq: FAQs): void {
    if (!faq._id) return;

    this.helpcenterService.markFaqAsNotHelpful(faq._id).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          faq.notHelpfulCount++;
        }
      },
      error: (error) => {
        console.error('Error marking FAQ as not helpful:', error);
      },
    });
  }

  contactSupport(): void {
    window.location.href = 'tel:+254701663066';
  }

  getArticleCount(topic: Topic): number {
    return topic.subTopics?.length || 0;
  }

  getFaqCount(subtopic: SubTopic): number {
    return subtopic.faqs?.length || 0;
  }

  getFallbackIcon(): string {
    return this.defaultIcon;
  }

  getImageUrl(image: any): string {
    if (!image) return this.defaultIcon;
    const url = typeof image === 'string' ? image : image.url || image.path;
    return url?.trim() ? url : this.defaultIcon;
  }

  hasTopicImage(topic: Topic): boolean {
    return !!this.getImageUrl(topic.image);
  }

  hasSubtopicImage(subtopic: SubTopic): boolean {
    return !!this.getImageUrl(subtopic.image);
  }

  handleIconError(event: Event): void {
    (event.target as HTMLImageElement).src = this.defaultIcon;
  }
}
