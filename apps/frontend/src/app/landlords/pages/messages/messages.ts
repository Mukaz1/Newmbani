import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';


interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  isRead?: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  isTyping?: boolean;
  unreadCount?: number;
  isOnline?: boolean;
  messages: Message[];
}


@Component({
  selector: 'app-messages',
  imports: [FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages implements OnInit {
  conversations: Conversation[] = [
    {
      id: '1',
      name: 'Jimmy Seinz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'I need you to ask about my salary this month. Why is the amount different from what I usually receive?',
      timestamp: '10:10 AM',
      isTyping: true,
      isOnline: true,
      messages: [
        {
          id: '1',
          text: 'I need you to ask about my salary this month. Why is the amount different from what I usually receive?',
          timestamp: '10:10 AM',
          isOwn: false
        },
        {
          id: '2',
          text: 'Hi Jimmy, thanks for reaching out. Let me check the details for you. Have you looked at your payslip for this month? It could be due to changes in deductions or overtime.',
          timestamp: '10:10 AM',
          isOwn: true,
          isRead: true
        },
        {
          id: '3',
          text: 'Yes, I\'ve seen the payslip, and it looks like the tax deductions are higher than last month. Was there a change in the tax regulations?',
          timestamp: '10:11 AM',
          isOwn: false
        },
        {
          id: '4',
          text: 'That\'s correct, Jimmy. There was a change in the tax rates starting this month, which is why the deduction is slightly higher. Is there anything else you\'d like to discuss?',
          timestamp: '10:11 AM',
          isOwn: true,
          isRead: true
        },
        {
          id: '5',
          text: 'I understand. Also, I wanted to confirm if my overtime pay is included in this month\'s salary.',
          timestamp: '10:12 AM',
          isOwn: false
        },
        {
          id: '6',
          text: 'I\'ve checked the system, and your overtime has been calculated and included in this month\'s salary. If you\'d like, I can send you the detailed breakdown of your overtime.',
          timestamp: '10:12 AM',
          isOwn: true,
          isRead: false
        }
      ]
    },
    {
      id: '2',
      name: 'Sally Deluna',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Just a quick reminder that the payro...',
      timestamp: '10:09 AM',
      unreadCount: 2,
      isOnline: false,
      messages: [
        {
          id: '1',
          text: 'Just a quick reminder that the payroll needs to be processed by tomorrow.',
          timestamp: '10:09 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '3',
      name: 'Lana Delrey',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hey there, I\'ve processed the payro...',
      timestamp: '10:08 AM',
      unreadCount: 3,
      isOnline: true,
      messages: [
        {
          id: '1',
          text: 'Hey there, I\'ve processed the payroll for this week.',
          timestamp: '10:08 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '4',
      name: 'Momo Ryn',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hi there, I noticed an issue with the...',
      timestamp: '10:07 AM',
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: '1',
          text: 'Hi there, I noticed an issue with the payroll calculations.',
          timestamp: '10:07 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '5',
      name: 'Kazutori',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Whats up! just wanted to let you kn...',
      timestamp: '10:06 AM',
      unreadCount: 2,
      isOnline: true,
      messages: [
        {
          id: '1',
          text: 'Whats up! just wanted to let you know about the update.',
          timestamp: '10:06 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '6',
      name: 'Sandy Shey',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Just wanted to let you know that the...',
      timestamp: '10:05 AM',
      unreadCount: 1,
      isOnline: false,
      messages: [
        {
          id: '1',
          text: 'Just wanted to let you know that the system is working fine now.',
          timestamp: '10:05 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '7',
      name: 'Sze Huang',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'I\'m finalizing this month\'s payroll an...',
      timestamp: '10:04 AM',
      isOnline: true,
      messages: [
        {
          id: '1',
          text: 'I\'m finalizing this month\'s payroll and need your approval.',
          timestamp: '10:04 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '8',
      name: 'Rin Seytaro',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Just confirming the salary adjustme...',
      timestamp: '10:03 AM',
      isOnline: false,
      messages: [
        {
          id: '1',
          text: 'Just confirming the salary adjustments for this quarter.',
          timestamp: '10:03 AM',
          isOwn: false
        }
      ]
    },
    {
      id: '9',
      name: 'Ashley Reins',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'I received your concern about the p...',
      timestamp: '10:02 AM',
      isOnline: true,
      messages: [
        {
          id: '1',
          text: 'I received your concern about the payroll discrepancy.',
          timestamp: '10:02 AM',
          isOwn: false
        }
      ]
    }
  ];

  selectedConversation: Conversation | null = null;
  searchQuery = '';
  newMessage = '';
  isMobile = false;

  constructor() {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    window.addEventListener('resize', () => this.checkScreenSize());
    // Auto-select first conversation on desktop
    if (!this.isMobile && this.conversations.length > 0) {
      this.selectedConversation = this.conversations[0];
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
  }

  get filteredConversations(): Conversation[] {
    if (!this.searchQuery) {
      return this.conversations;
    }
    return this.conversations.filter(conv =>
      conv.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    // Mark as read
    conversation.unreadCount = 0;

    // Stop typing indicator
    setTimeout(() => {
      if (this.selectedConversation?.id === conversation.id) {
        this.selectedConversation.isTyping = false;
      }
    }, 2000);
  }

  backToConversations(): void {
    this.selectedConversation = null;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      text: this.newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      isOwn: true,
      isRead: false
    };

    this.selectedConversation.messages.push(message);
    this.selectedConversation.lastMessage = message.text;
    this.selectedConversation.timestamp = message.timestamp;

    this.newMessage = '';

    // Simulate read receipt
    setTimeout(() => {
      if (message) {
        message.isRead = true;
      }
    }, 1000);
  }
}
