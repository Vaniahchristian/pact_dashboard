import { User } from '../types';

const usersData: User[] = [
  {
    id: 'usr1',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@tpm.com',
    phone: '+234 800 123 4567',
    employeeId: 'EMP001',
    role: 'admin',
    status: 'active',
    isApproved: true,
    avatar: '/placeholder.svg',
    location: {
      latitude: 9.0765,
      longitude: 7.3986,
      lastUpdated: new Date().toISOString(),
    },
    wallet: {
      balance: 5000,
      currency: 'SDG',
    },
    performance: {
      rating: 4.9,
      totalCompletedTasks: 128,
      onTimeCompletion: 98,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
    },
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr2',
    username: 'ict',
    name: 'ICT Officer',
    email: 'ict@tpm.com',
    phone: '+234 800 456 7890',
    employeeId: 'EMP002',
    role: 'ict',
    status: 'active',
    isApproved: true,
    wallet: {
      balance: 0,
      currency: 'SDG',
    },
    performance: {
      rating: 4.7,
      totalCompletedTasks: 56,
      onTimeCompletion: 95,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: true,
      },
    },
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr3',
    username: 'fom',
    name: 'Field Operations Manager',
    email: 'fom@tpm.com',
    phone: '+234 800 987 6543',
    employeeId: 'EMP003',
    role: 'fom',
    status: 'active',
    isApproved: true,
    wallet: {
      balance: 0,
      currency: 'SDG',
    },
    performance: {
      rating: 4.8,
      totalCompletedTasks: 42,
      onTimeCompletion: 100,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: false,
        sms: true,
      },
    },
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr4',
    username: 'supervisor',
    name: 'Field Supervisor',
    email: 'supervisor@tpm.com',
    phone: '+234 800 111 2222',
    employeeId: 'EMP004',
    role: 'supervisor',
    status: 'active',
    isApproved: true,
    wallet: {
      balance: 0,
      currency: 'SDG',
    },
    performance: {
      rating: 4.5,
      totalCompletedTasks: 87,
      onTimeCompletion: 92,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
    },
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr5',
    username: 'coordinator',
    name: 'Field Coordinator',
    email: 'coordinator@tpm.com',
    phone: '+234 800 333 4444',
    employeeId: 'EMP005',
    role: 'coordinator',
    status: 'active',
    isApproved: true,
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    wallet: {
      balance: 3200,
      currency: 'SDG',
    },
    performance: {
      rating: 4.2,
      totalCompletedTasks: 64,
      onTimeCompletion: 88,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: false,
        push: true,
        sms: true,
      },
    },
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr6',
    username: 'datacollector',
    name: 'Data Collector',
    email: 'datacollector@tpm.com',
    phone: '+234 800 555 6666',
    employeeId: 'EMP006',
    role: 'dataCollector',
    status: 'active',
    isApproved: true,
    avatar: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      latitude: 9.0566,
      longitude: 7.4886,
      lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    },
    wallet: {
      balance: 1850,
      currency: 'SDG',
    },
    performance: {
      rating: 4.0,
      totalCompletedTasks: 32,
      onTimeCompletion: 75,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: false,
        push: true,
        sms: false,
      },
    },
    availability: 'online',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'usr7',
    username: 'pending',
    name: 'Pending User',
    email: 'pending@tpm.com',
    phone: '+234 800 777 8888',
    employeeId: 'EMP007',
    role: 'dataCollector',
    status: 'pending',
    isApproved: false,
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    wallet: {
      balance: 0,
      currency: 'SDG',
    },
    performance: {
      rating: 0,
      totalCompletedTasks: 0,
      onTimeCompletion: 0,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: true,
      },
    },
    availability: 'offline',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr8',
    username: 'ahmed',
    name: 'Ahmed Hassan',
    email: 'ahmed@tpm.com',
    phone: '+249 91 234 5678',
    employeeId: 'EMP008',
    role: 'dataCollector',
    status: 'active',
    isApproved: true,
    avatar: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    location: {
      latitude: 9.1234,
      longitude: 7.5678,
      lastUpdated: new Date().toISOString(),
    },
    wallet: {
      balance: 1200,
      currency: 'SDG',
    },
    performance: {
      rating: 4.3,
      totalCompletedTasks: 28,
      onTimeCompletion: 85,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: false,
      },
    },
    stateId: 'khartoum',
    localityId: 'khartoum-city',
    availability: 'online',
    lastActive: new Date().toISOString(),
  },
  {
    id: 'usr9',
    username: 'sarah',
    name: 'Sarah Mahmoud',
    email: 'sarah@tpm.com',
    phone: '+249 99 876 5432',
    employeeId: 'EMP009',
    role: 'coordinator',
    status: 'active',
    isApproved: true,
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    wallet: {
      balance: 2500,
      currency: 'SDG',
    },
    performance: {
      rating: 4.7,
      totalCompletedTasks: 45,
      onTimeCompletion: 93,
    },
    settings: {
      language: 'en',
      notificationPreferences: {
        email: true,
        push: true,
        sms: true,
      },
    },
    stateId: 'gezira',
    localityId: 'wad-madani',
    availability: 'online',
    lastActive: new Date().toISOString(),
  }
];

// Bank account logic for coordinators and data collectors
export const users: User[] = usersData.map(user => ({
  ...user,
  wallet: {
    ...user.wallet,
    currency: 'SDG',
  },
  bankAccount: user.role === 'coordinator' || user.role === 'dataCollector'
    ? {
        accountName: `${user.name}`,
        branch: `${user.employeeId ? 'Branch-' + user.employeeId : 'Main Branch'}`,
        accountNumber: `${Math.floor(1000000 + Math.random() * 9000000).toString().substring(0, 7)}`
      }
    : undefined
}));
