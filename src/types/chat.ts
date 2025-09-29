
import { User } from './user';

export interface Chat {
  id: string;
  participants: string[];
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: ChatMessage;
  unreadCount?: number;
  status: 'active' | 'archived' | 'deleted';
  
  // Additional properties being used in the codebase
  name: string;
  type: 'private' | 'group' | 'state-group';
  relatedEntityId?: string;
  relatedEntityType?: 'mmpFile' | 'siteVisit' | 'project';
  stateId?: string;
  isStateGroup?: boolean;
  pinnedMessageId?: string | null;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'image' | 'file' | 'location' | 'audio';
  timestamp: string;
  readBy: string[];
  status: 'sent' | 'delivered' | 'read' | 'failed';
  read?: boolean; // Added this property to match existing code
  attachments?: {
    url: string;
    type: string;
    name: string;
    size?: number;
  }[];
  metadata?: {
    replyTo?: string;
    forwardedFrom?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    };
    reactions?: Record<string, string[]>;
  };
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  selectedUsers: User[];
  createChat: (participants: string[], isGroup: boolean, groupName?: string) => Promise<string>;
  sendMessage: (content: string, contentType: ChatMessage['contentType'], attachments?: ChatMessage['attachments'], metadata?: ChatMessage['metadata']) => Promise<boolean>;
  loadChat: (chatId: string) => Promise<boolean>;
  loadChats: () => Promise<boolean>;
  markAsRead: (chatId: string, messageIds?: string[]) => Promise<boolean>;
  deleteChat: (chatId: string) => Promise<boolean>;
  archiveChat: (chatId: string) => Promise<boolean>;
  selectUser: (user: User) => void;
  removeSelectedUser: (userId: string) => void;
  clearSelectedUsers: () => void;
}
