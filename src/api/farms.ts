// =====================================================================
// 2. Farm Data — POST /api/farms/{farmId}/data
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import type { FarmDataSubmitRequest, FarmDataSubmitResponse } from '@/types/api'

export async function submitFarmData(req: FarmDataSubmitRequest): Promise<FarmDataSubmitResponse> {
  if (USE_MOCK) {
    await delay()
    return {
      batch_id: `BCH-2024-${Math.floor(Math.random() * 9000 + 1000)}`,
      tx_hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      submitted_at: new Date().toISOString(),
    }
  }
  return request<FarmDataSubmitResponse>(`/api/farms/${req.farm_id}/data`, {
    method: 'POST',
    body: req,
  })
}
