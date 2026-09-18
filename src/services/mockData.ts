import { FinancialEvent, UserProfile } from '../types';

export const HEDERA_TOPIC_ID = '0.0.10581166';
export const TRUSTLINE_NODE_ID = '0.0.482910';

export const initialProfile: UserProfile = {
  id: 'usr_ahmed_ba_2026',
  name: 'Ahmed Ben Ali',
  tagline: 'Junior Software & UI Freelancer | TBS Computer Science Student',
  occupation: 'Independent Frontend Developer & Student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  location: 'Tunis, Tunisia',
  nationalIdMasked: 'TN-09***412',
  hederaAccountId: '0.0.781944',
  portableDid: 'did:hedera:testnet:0.0.781944_trustline_cred',
  conventionalCreditHistory: 'Limited',
  verifiedFinancialEvents: 14,
  repaymentObligations: 12,
  completedObligations: 11,
  onTimeObligations: 10,
  lateObligations: 1,
  defaults: 0,
  verifiedIncomeSources: 3,
  incomesList: [
    {
      source: 'Remote Web Studio (Paris)',
      type: 'Freelance Frontend Retainer',
      monthlyAvg: 1100,
      verifiedSince: 'Oct 2025'
    },
    {
      source: 'Local Enterprise E-Commerce',
      type: 'Contract Maintenance',
      monthlyAvg: 850,
      verifiedSince: 'Aug 2025'
    },
    {
      source: 'University Tutoring Bureau',
      type: 'Academic Lab Assistant',
      monthlyAvg: 300,
      verifiedSince: 'Feb 2025'
    }
  ]
};

export const initialEvents: FinancialEvent[] = [
  {
    id: 'evt-01',
    title: 'University Tuition Fee Payment',
    category: 'EDUCATION',
    amount: 1200,
    currency: 'TND',
    date: '2025-09-12',
    dueDate: '2025-09-15',
    isObligation: true,
    status: 'COMPLETED',
    counterparty: 'Tunis Business School / Université de Tunis',
    description: 'Fall semester tuition payment verified through automated institutional bank transfer.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1041,
      consensusTimestamp: '1726135200.104192001',
      formattedTimestamp: '2025-09-12 10:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1726135190.410291`,
      runningHash: '4a9f3b7d8e2c1109a8b7e6f5d4c3b2a10987654321fedcba0987654321abcdef',
      messageHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-02',
    title: 'Freelance Client Retainer',
    category: 'INCOME',
    amount: 850,
    currency: 'TND',
    date: '2025-09-28',
    isObligation: false,
    status: 'VERIFIED',
    counterparty: 'NovaTech Digital Studio',
    description: 'Direct wire deposit for frontend responsive web implementation milestones.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1078,
      consensusTimestamp: '1727521200.298104882',
      formattedTimestamp: '2025-09-28 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1727521188.192048`,
      runningHash: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      messageHash: 'b5a2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-03',
    title: 'Telecom Mobile & 4G Line Bill',
    category: 'UTILITY',
    amount: 75,
    currency: 'TND',
    date: '2025-10-04',
    dueDate: '2025-10-05',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'Tunisie Télécom / Ooredoo',
    description: 'Postpaid mobile voice and developer 4G hotspot plan auto-settled on due date.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1112,
      consensusTimestamp: '1728039600.412093812',
      formattedTimestamp: '2025-10-04 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1728039591.902184`,
      runningHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      messageHash: 'f4c3b2a10987654321fedcba0987654321abcdef4a9f3b7d8e2c1109a8b7e6f5',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-04',
    title: 'Micro-Loan Installment #1',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2025-10-15',
    dueDate: '2025-10-15',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Installment 1 of 6 for textbook and exam licensing equipment credit facility.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1145,
      consensusTimestamp: '1728990000.198302918',
      formattedTimestamp: '2025-10-15 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1728989985.481902`,
      runningHash: '9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
      messageHash: '90123456789abcdef0123456789abcdef0123456789abcdef0b5a2c3d4e5f678',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-05',
    title: 'Micro-Loan Installment #2',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2025-11-15',
    dueDate: '2025-11-15',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Installment 2 of 6 paid directly via verified mobile postal D17 clearing.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1189,
      consensusTimestamp: '1731668400.312984712',
      formattedTimestamp: '2025-11-15 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1731668388.940128`,
      runningHash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
      messageHash: 'c4ca4238a0b923820dcc509a6f75849b280386c919a6d4e5b8d3a1f28b49e0c1',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-06',
    title: 'Micro-Loan Installment #3',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2025-12-14',
    dueDate: '2025-12-15',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Installment 3 of 6 completed 1 day in advance of scheduled due date.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1224,
      consensusTimestamp: '1734174000.582910492',
      formattedTimestamp: '2025-12-14 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1734173989.129481`,
      runningHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      messageHash: 'a8b7e6f5d4c3b2a10987654321fedcba0987654321abcdef4a9f3b7d8e2c1109',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-07',
    title: 'Shared Studio Rent Payment',
    category: 'HOUSING',
    amount: 500,
    currency: 'TND',
    date: '2026-01-02',
    dueDate: '2026-01-05',
    isObligation: true,
    status: 'VERIFIED',
    counterparty: 'Carthage Living Accommodations',
    description: 'Monthly student lease payment verified via landlord direct receipt attestation.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1260,
      consensusTimestamp: '1735815600.891204918',
      formattedTimestamp: '2026-01-02 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1735815590.291048`,
      runningHash: '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
      messageHash: 'fedcba0987654321abcdef4a9f3b7d8e2c1109a8b7e6f5d4c3b2a10987654321',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-08',
    title: 'International Freelance Wire Transfer',
    category: 'INCOME',
    amount: 1100,
    currency: 'TND',
    date: '2026-01-10',
    isObligation: false,
    status: 'VERIFIED',
    counterparty: 'DevHorizon SAS (France)',
    description: 'Cross-border payout for React Native sprint deliverables, converted through BIAT Bank.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1298,
      consensusTimestamp: '1736506800.129481902',
      formattedTimestamp: '2026-01-10 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1736506782.491028`,
      runningHash: '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
      messageHash: '6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-09',
    title: 'Micro-Loan Installment #4',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2026-01-19',
    dueDate: '2026-01-15',
    isObligation: true,
    status: 'PAID_LATE',
    daysLate: 4,
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Settled 4 days late due to international banking wire clearance window; cured in full without default.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1332,
      consensusTimestamp: '1737284400.671920381',
      formattedTimestamp: '2026-01-19 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1737284381.109284`,
      runningHash: 'd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      messageHash: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-10',
    title: 'Electricity & Utility Municipal Bill',
    category: 'UTILITY',
    amount: 65,
    currency: 'TND',
    date: '2026-01-24',
    dueDate: '2026-01-25',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'STEG (Société Tunisienne de l\'Electricité et du Gaz)',
    description: 'Quarterly student studio electricity and heating invoice verified via e-billing portal.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1365,
      consensusTimestamp: '1737716400.912840192',
      formattedTimestamp: '2026-01-24 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1737716390.812903`,
      runningHash: '0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
      messageHash: '1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-11',
    title: 'Freelance Design Retainer Payment',
    category: 'INCOME',
    amount: 950,
    currency: 'TND',
    date: '2026-01-30',
    isObligation: false,
    status: 'VERIFIED',
    counterparty: 'Atelier Carthage Digital',
    description: 'Bi-monthly design & Figma UI system delivery fee verified through bank attestation.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1399,
      consensusTimestamp: '1738234800.381902847',
      formattedTimestamp: '2026-01-30 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1738234789.291048`,
      runningHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      messageHash: 'f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-12',
    title: 'Micro-Loan Installment #5',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2026-02-14',
    dueDate: '2026-02-15',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Installment 5 of 6 paid promptly on schedule.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1438,
      consensusTimestamp: '1739530800.741092831',
      formattedTimestamp: '2026-02-14 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1739530784.810291`,
      runningHash: '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
      messageHash: '2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-13',
    title: 'Coworking Hub Desk Membership',
    category: 'MEMBERSHIP',
    amount: 120,
    currency: 'TND',
    date: '2026-02-28',
    dueDate: '2026-03-01',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'The Dot Innovation Space Tunis',
    description: 'Monthly high-speed developer desk subscription settled prior to invoice due date.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1472,
      consensusTimestamp: '1740740400.190284712',
      formattedTimestamp: '2026-02-28 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1740740388.940129`,
      runningHash: '6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e',
      messageHash: 'b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  },
  {
    id: 'evt-14',
    title: 'Micro-Loan Final Installment #6',
    category: 'MICRO_LOAN',
    amount: 200,
    currency: 'TND',
    date: '2026-03-14',
    dueDate: '2026-03-15',
    isObligation: true,
    status: 'PAID_ON_TIME',
    counterparty: 'TBS Community Student Micro-Credit Fund',
    description: 'Final closure payment for the 6-month micro-credit facility. Facility successfully retired with zero defaults.',
    proof: {
      topicId: HEDERA_TOPIC_ID,
      sequenceNumber: 1510,
      consensusTimestamp: '1741950000.829104819',
      formattedTimestamp: '2026-03-14 11:00:00 UTC',
      transactionId: `${TRUSTLINE_NODE_ID}@1741949989.310284`,
      runningHash: 'e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1',
      messageHash: '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      submitterAccountId: TRUSTLINE_NODE_ID,
      explorerUrl: 'https://hashscan.io/testnet/topic/0.0.10581166'
    }
  }
];
