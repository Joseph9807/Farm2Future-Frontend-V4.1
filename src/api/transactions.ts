// =====================================================================
// 4. Transactions — GET /api/transactions
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import { MOCK_TRANSACTIONS } from './__mocks__'
import type {
  Transaction,
  GetTransactionsParams,
  GetTransactionsResponse,
} from '@/types/api'

export async function getTransactions(
  params: GetTransactionsParams = {},
): Promise<GetTransactionsResponse> {
  if (USE_MOCK) {
    await delay(400)
    const { search = '' } = params
    const filtered = MOCK_TRANSACTIONS.filter(t => {
      if (!search) return true
      const q = search.toLowerCase()
      return [t.id, t.token, t.from, t.to].some(x => x.toLowerCase().includes(q))
    })
    return { items: filtered, total: filtered.length, page: params.page ?? 1, size: params.size ?? filtered.length }
  }
  return request<GetTransactionsResponse>('/api/transactions', {
    query: params as Record<string, string | number | undefined>,
  })
}

/** Convenience: flat list, matches what the page used to render. */
export async function listTransactions(params: GetTransactionsParams = {}): Promise<Transaction[]> {
  const res = await getTransactions(params)
  return res.items
}
