// =====================================================================
// Mock Data — central registry. Originally inlined in each page; moved
// here so the api/ layer can return it uniformly. When the real backend
// is ready, this file becomes unused (USE_MOCK = false).
// =====================================================================

import type {
  User,
  Transaction,
  Token,
  DashboardOverviewResponse,
  ESGReportResponse,
  AlertSeverity,
} from '@/types/api'

// ---------- 1. Auth — mockUsers ----------
export const MOCK_USERS: Record<string, User> = {
  farmer:     { id: 'u1', name: 'Joseph',       role: 'farmer',    entityName: 'Green Valley Farm' },
  buyer:      { id: 'u2', name: 'James',        role: 'buyer',     entityName: 'EcoFoods Corp' },
  regulator:  { id: 'u3', name: 'Gov Official', role: 'regulator', entityName: 'Dept of Agriculture' },
}

// ---------- 4. Transactions ----------
export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-2024-101', token: 'TKN-2024-001', from: 'System',           to: 'Green Valley Farm', date: '2024-10-12 09:30', status: 'completed' },
  { id: 'TXN-2024-102', token: 'TKN-2024-002', from: 'Green Valley Farm', to: 'EcoFoods Corp',     date: '2024-10-14 11:15', status: 'completed' },
  { id: 'TXN-2024-103', token: 'TKN-2024-003', from: 'System',           to: 'Sunrise Organics',  date: '2024-10-15 14:20', status: 'pending'   },
  { id: 'TXN-2024-104', token: 'TKN-2024-004', from: 'Highland Pastures', to: 'Global Mills',     date: '2024-10-18 08:45', status: 'completed' },
  { id: 'TXN-2024-105', token: 'TKN-2024-005', from: 'System',           to: 'Green Valley Farm', date: '2024-10-20 16:10', status: 'failed'    },
  { id: 'TXN-2024-106', token: 'TKN-2024-006', from: 'EcoFoods Corp',    to: 'Retailer Inc',      date: '2024-10-22 10:05', status: 'completed' },
  { id: 'TXN-2024-107', token: 'TKN-2024-007', from: 'Sunrise Organics', to: 'EcoFoods Corp',     date: '2024-10-25 13:40', status: 'completed' },
  { id: 'TXN-2024-108', token: 'TKN-2024-008', from: 'System',           to: 'Highland Pastures', date: '2024-10-28 09:15', status: 'completed' },
]

// ---------- 3. Tokens (Regulator monitoring) ----------
export const MOCK_TOKENS: Token[] = [
  { id: 'TKN-2024-001', asset: 'Wheat Batch A',   owner: 'Green Valley Farm',  status: 'normal',  date: '2024-10-12 09:30' },
  { id: 'TKN-2024-002', asset: 'Rice Batch C',    owner: 'EcoFoods Corp',      status: 'normal',  date: '2024-10-14 11:15' },
  { id: 'TKN-2024-003', asset: 'Corn Batch B',    owner: 'Sunrise Organics',   status: 'flagged', date: '2024-10-15 14:20' },
  { id: 'TKN-2024-004', asset: 'Soybeans Batch A', owner: 'Highland Pastures', status: 'normal',  date: '2024-10-18 08:45' },
  { id: 'TKN-2024-005', asset: 'Cotton Batch D',  owner: 'Green Valley Farm',  status: 'at-risk', date: '2024-10-20 16:10' },
  { id: 'TKN-2024-006', asset: 'Wheat Batch B',   owner: 'EcoFoods Corp',      status: 'normal',  date: '2024-10-22 10:05' },
  { id: 'TKN-2024-007', asset: 'Rice Batch D',    owner: 'Sunrise Organics',   status: 'flagged', date: '2024-10-25 13:40' },
  { id: 'TKN-2024-008', asset: 'Corn Batch C',    owner: 'Highland Pastures',  status: 'normal',  date: '2024-10-28 09:15' },
]

// ---------- 3. Tokens (Transfer page — recent transfers) ----------
export const MOCK_RECENT_TRANSFERS = [
  { id: 'TXN-8829', token: 'TKN-2024-002', to: 'EcoFoods Corp',     date: 'Oct 24, 2024' },
  { id: 'TXN-8810', token: 'TKN-2024-006', to: 'Global Mills',      date: 'Oct 20, 2024' },
  { id: 'TXN-8795', token: 'TKN-2023-142', to: 'Sunrise Organics',  date: 'Oct 15, 2024' },
]

// ---------- 6. Dashboard ----------
export const MOCK_DASHBOARD_OVERVIEW: DashboardOverviewResponse = {
  tier: 'Excellent',
  stats: {
    overall: 87,
    environmental: 82,
    social: 91,
    governance: 88,
    changes: { overall: 4.2, environmental: 2.1, social: 1.5, governance: -0.5 },
  },
  chart: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    values: [72, 75, 74, 78, 80, 82, 81, 84, 85, 86, 87, 87],
  },
  alerts: [
    { id: 1, title: 'Unusual water usage detected',     entity: 'Green Valley Farm',  time: '2 hours ago', severity: 'at-risk' as AlertSeverity },
    { id: 2, title: 'Missing carbon offset certificate', entity: 'Highland Pastures',  time: '5 hours ago', severity: 'flagged' as AlertSeverity },
    { id: 3, title: 'Yield data anomaly',                entity: 'Sunrise Organics',   time: '1 day ago',   severity: 'at-risk' as AlertSeverity },
    { id: 4, title: 'Fertiliser overuse warning',        entity: 'Green Valley Farm',  time: '1 day ago',   severity: 'flagged' as AlertSeverity },
    { id: 5, title: 'Soil pH level drop detected',       entity: 'Highland Pastures',  time: '2 days ago',  severity: 'at-risk' as AlertSeverity },
  ],
  farms: ['All Farms', 'Green Valley Farm', 'Sunrise Organics', 'Highland Pastures'],
}

// ---------- 5. ESG Reports ----------
export const MOCK_ESG_REPORT_GENERIC: ESGReportResponse = {
  period: { from: '2024-01-01', to: '2024-12-31' },
  entity: 'All Entities',
  scores: [
    { label: 'Environmental (E)', score: 82, note: 'Carbon footprint reduced by 12% YoY.' },
    { label: 'Social (S)',        score: 91, note: 'Fair labor practices verified across 100% of supply chain.' },
    { label: 'Governance (G)',    score: 88, note: 'All compliance audits passed successfully.' },
  ],
  risk_flags: [
    { type: 'success', title: 'Water Usage Optimization',   desc: 'Green Valley Farm achieved 20% reduction in water usage.' },
    { type: 'warning', title: 'Fertilizer Data Gap',        desc: 'Missing Q3 fertilizer logs for Highland Pastures.' },
    { type: 'danger',  title: 'Carbon Offset Expiry',       desc: 'Sunrise Organics certificates expiring in 14 days.' },
  ],
  generated_at: '2024-12-31T23:59:59Z',
}

export const MOCK_ESG_REPORT_FARMER = (entityName: string): ESGReportResponse => ({
  period: { from: '2024-01-01', to: '2024-12-31' },
  entity: entityName,
  scores: MOCK_ESG_REPORT_GENERIC.scores,
  risk_flags: [
    { type: 'success', title: 'Water Usage Optimization', desc: `${entityName} achieved 20% reduction in water usage.` },
    { type: 'warning', title: 'Fertiliser Overuse Warning', desc: 'Q4 fertiliser usage exceeded recommended levels by 8%.' },
  ],
  generated_at: MOCK_ESG_REPORT_GENERIC.generated_at,
})
