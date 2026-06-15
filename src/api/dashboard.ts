// =====================================================================
// 6. Dashboard — GET /api/dashboard/overview
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import { MOCK_DASHBOARD_OVERVIEW } from './__mocks__'
import type {
  DashboardOverviewResponse,
  GetDashboardOverviewParams,
} from '@/types/api'

export async function getDashboardOverview(
  params: GetDashboardOverviewParams = {},
): Promise<DashboardOverviewResponse> {
  if (USE_MOCK) {
    await delay()
    // Per-farm filtering: farmer sees only their own alerts; others see all.
    const farm = params.farm ?? 'All Farms'
    if (farm === 'All Farms') return MOCK_DASHBOARD_OVERVIEW
    return {
      ...MOCK_DASHBOARD_OVERVIEW,
      alerts: MOCK_DASHBOARD_OVERVIEW.alerts.filter(a => a.entity === farm),
    }
  }
  return request<DashboardOverviewResponse>('/api/dashboard/overview', {
    query: { farm: params.farm },
  })
}
