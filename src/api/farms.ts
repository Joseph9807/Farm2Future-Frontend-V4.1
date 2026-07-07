// =====================================================================
// 2. Farm Data — POST /api/farms/{farmId}/data
//    GET  /api/farms/batches
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import { MOCK_FARM_BATCHES } from './__mocks__'
import type {
  FarmDataSubmitRequest,
  FarmDataSubmitResponse,
  FarmBatchSummary,
  GetFarmBatchesParams,
} from '@/types/api'

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

export async function getFarmBatches(
  params: GetFarmBatchesParams = {},
): Promise<FarmBatchSummary[]> {
  if (USE_MOCK) {
    await delay(300)
    let batches = MOCK_FARM_BATCHES
    if (params.farmId) batches = batches.filter(b => b.farm_id === params.farmId)
    if (params.cropType) batches = batches.filter(b => b.crop_type === params.cropType)
    return batches
  }
  return request<FarmBatchSummary[]>('/api/farms/batches', {
    query: params as Record<string, string | number | undefined>,
  })
}
