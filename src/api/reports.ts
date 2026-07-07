// =====================================================================
// 5. ESG Reports — 2 endpoints
//    POST /api/reports/esg/generate
//    GET  /api/reports/esg/export?format=csv|pdf
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import { MOCK_ESG_REPORT_GENERIC, MOCK_ESG_REPORT_FARMER } from './__mocks__'
import type {
  ESGReportRequest,
  ESGReportResponse,
  ReportFormat,
  ExportReportResponse,
} from '@/types/api'

export async function generateESGReport(req: ESGReportRequest): Promise<ESGReportResponse> {
  if (USE_MOCK) {
    await delay()
    // Farmer-specific (1 farm) returns only 2 risk flags; otherwise generic 3.
    return req.entity === 'All Entities'
      ? MOCK_ESG_REPORT_GENERIC
      : MOCK_ESG_REPORT_FARMER(req.entity)
  }
  return request<ESGReportResponse>('/api/reports/esg/generate', { method: 'POST', body: req })
}

export async function exportESGReport(
  format: ReportFormat,
  options?: { farmId?: string; from?: string },
): Promise<ExportReportResponse> {
  if (USE_MOCK) {
    await delay()
    const label = [options?.farmId, options?.from].filter(Boolean).join(' / ')
    return {
      download_url: `data:text/plain;charset=utf-8,Mock ${format} export${label ? ` (${label})` : ''}`,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }
  }
  return request<ExportReportResponse>('/api/reports/esg/export', {
    query: {
      format: format.toLowerCase(),
      farmId: options?.farmId || undefined,
      from: options?.from || undefined,
    },
  })
}
