
// These are just placeholder types to avoid TypeScript errors.
// You would replace these with your actual types.

import { AppRole } from './roles';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  isApproved?: boolean;
  employeeId?: string;
  stateId?: string;
  localityId?: string;
  hubId?: string;
  avatar?: string;
  username?: string;
  fullName?: string;
  lastActive: string;  // Changed from optional to required
  performance?: {
    rating: number;
    totalCompletedTasks: number;
    onTimeCompletion: number;
    currentWorkload?: number;
  };
  wallet: {
    balance: number;
    currency: string;
    transactions?: any[];
  };
  location?: {
    latitude?: number;
    longitude?: number;
    region?: string;
    address?: string;
    isSharing?: boolean;
    lastUpdated?: string;
  };
  settings?: {
    language?: string;
    notificationPreferences?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    theme?: 'light' | 'dark' | 'system';
    defaultPage?: string;
    autoWithdraw?: boolean;
    withdrawThreshold?: number;
    paymentNotifications?: boolean;
    shareLocationWithTeam?: boolean;
    displayPersonalMetrics?: boolean;
  };
  bankAccount?: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    branch?: string;
    swiftCode?: string;
  };
  availability: string;  // Changed from optional to required
  roles?: AppRole[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister extends UserLogin {
  name: string;
  phone?: string;
  role?: string;
}

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  avatar?: string;
  settings?: User['settings'];
}
