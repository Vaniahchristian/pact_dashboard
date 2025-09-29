import { Transaction } from '../types';

// Transactions mock data
const transactionsData: Transaction[] = [
  {
    id: 'tx1',
    userId: 'usr6',
    amount: 160,
    currency: 'SDG',
    type: 'credit',
    status: 'completed',
    description: 'Payment for completing site visit at Abuja Main Hospital',
    siteVisitId: 'sv1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    method: 'Wallet',
    reference: 'PAY-SV1-12345',
  },
  {
    id: 'tx2',
    userId: 'usr6',
    amount: 100,
    currency: 'SDG',
    type: 'debit',
    status: 'completed',
    description: 'Withdrawal via Bank Transfer',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    method: 'Bank Transfer',
    reference: 'WD-67890',
  },
  {
    id: 'tx3',
    userId: 'usr5',
    amount: 135,
    currency: 'SDG',
    type: 'credit',
    status: 'pending',
    description: 'Payment for site visit at Enugu Rural Clinic',
    siteVisitId: 'sv5',
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    method: 'Wallet',
    reference: 'PAY-SV5-54321',
  },
];

// Export transactions with SDG currency
export const transactions: Transaction[] = transactionsData.map(transaction => ({
  ...transaction,
  currency: 'SDG',
}));
