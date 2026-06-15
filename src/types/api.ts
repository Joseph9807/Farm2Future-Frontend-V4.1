// =====================================================================
// API Types — shared by both the api/ layer and the page components.
// Mirrors the structure described in API_CONTRACT.md.
// All IDs are strings for consistency with blockchain tx_hashes.
// =====================================================================

// ---------- Common ----------
export type Role = 'farmer' | 'buyer' | 'regulator'
export type TxnStatus = 'completed' | 'pending' | 'failed'
export type TokenStatus = 'normal' | 'flagged' | 'at-risk'
export type AlertSeverity = 'flagged' | 'at-risk'
export type CropType = 'Wheat' | 'Rice' | 'Corn' | 'Soybeans' | 'Cotton'
export type FertiliserType = 'Organic Compost' | 'Synthetic NPK' | 'Bio-fertiliser' | 'None'

export interface User {
  id: string
  name: string
  role: Role
  entityName: string
}

// ---------- 1. Auth ----------
export interface LoginRequest {
  email: string
  password: string
  role: Role
}
export interface LoginResponse {
  user: User
  token: string
}

// ---------- 2. Farm Data ----------
export interface FarmBatch {
  crop_type: CropType
  date: string                  // ISO date
  yield_kg: number
  water_usage_l: number
  fertiliser_type: FertiliserType
  fertiliser_usage_kg: number
}
export interface IotSnapshot {
  soil_moisture_pct: number
  temperature_c: number
  humidity_pct: number
  ph_level: number
}
export interface FarmDataSubmitRequest {
  farm_id: string
  batch: FarmBatch
  iot_snapshot: IotSnapshot
}
export interface FarmDataSubmitResponse {
  batch_id: string              // e.g. "BCH-2024-8921"
  tx_hash: string               // blockchain tx hash
  submitted_at: string          // ISO timestamp
}

// ---------- 3. Tokens ----------
export interface TokenIssueRequest {
  crop_type: CropType
  batch_id: string
  quantity_kg: number
}
export interface TokenIssueResponse {
  token_id: string              // e.g. "TKN-2024-009"
  tx_hash: string
}

export interface TokenTransferRequest {
  token_id: string
  new_owner_address: string
}
export interface TokenTransferResponse {
  tx_hash: string
  transferred_at: string
}

export interface Token {
  id: string
  asset: string                 // e.g. "Wheat Batch A"
  owner: string
  status: TokenStatus
  date: string                  // ISO datetime
}
export interface GetTokensParams {
  status?: 'all' | 'normal' | 'flagged' | 'at-risk'
  search?: string
  page?: number
  size?: number
}
export interface GetTokensResponse {
  items: Token[]
  total: number
  page: number
  size: number
}

// ---------- 4. Transactions ----------
export interface Transaction {
  id: string                    // e.g. "TXN-2024-101"
  token: string                 // e.g. "TKN-2024-001"
  from: string
  to: string
  date: string                  // ISO datetime
  status: TxnStatus
}
export interface GetTransactionsParams {
  search?: string
  date?: string                 // ISO date filter
  page?: number
  size?: number
}
export interface GetTransactionsResponse {
  items: Transaction[]
  total: number
  page: number
  size: number
}

// ---------- 5. ESG Reports ----------
export interface ESGReportRequest {
  from: string                  // ISO date
  to: string                    // ISO date
  entity: string                // entityName or "All Entities"
}
export interface ESGReportScore {
  label: 'Environmental (E)' | 'Social (S)' | 'Governance (G)'
  score: number                 // 0-100
  note: string
}
export interface ESGRiskFlag {
  type: 'success' | 'warning' | 'danger'
  title: string
  desc: string
}
export interface ESGReportResponse {
  period: { from: string; to: string }
  entity: string
  scores: ESGReportScore[]
  risk_flags: ESGRiskFlag[]
  generated_at: string
}
export type ReportFormat = 'CSV' | 'PDF'
export interface ExportReportResponse {
  download_url: string
  expires_at: string
}

// ---------- 6. Dashboard ----------
export interface DashboardStats {
  overall: number               // 0-100
  environmental: number
  social: number
  governance: number
  changes: {
    overall: number
    environmental: number
    social: number
    governance: number
  }
}
export interface DashboardChartPoint {
  label: string                 // month, e.g. "Jan"
  value: number
}
export interface DashboardAlert {
  id: number
  title: string
  entity: string
  time: string                  // human readable
  severity: AlertSeverity
}
export interface DashboardOverviewResponse {
  tier: 'Excellent' | 'Good' | 'At Risk'
  stats: DashboardStats
  chart: DashboardChartPoint[]
  alerts: DashboardAlert[]
  farms: string[]               // list of farm entityNames + "All Farms"
}
export interface GetDashboardOverviewParams {
  farm?: string                 // "All Farms" or a specific entityName
}

// ---------- Common error shape (per API_CONTRACT.md §Errors) ----------
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
export interface ApiErrorResponse {
  error: ApiError
}
