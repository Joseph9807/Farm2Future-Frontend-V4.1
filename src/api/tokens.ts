// =====================================================================
// 3. Tokens — 3 endpoints
//    POST /api/tokens                  (issue)
//    POST /api/tokens/{tokenId}/transfer
//    GET  /api/tokens                  (regulator monitoring)
// =====================================================================

import { USE_MOCK, request, delay } from './client'
import { MOCK_TOKENS } from './__mocks__'
import type {
  Token,
  TokenIssueRequest,
  TokenIssueResponse,
  TokenTransferRequest,
  TokenTransferResponse,
  GetTokensParams,
  GetTokensResponse,
} from '@/types/api'

export async function issueToken(req: TokenIssueRequest): Promise<TokenIssueResponse> {
  if (USE_MOCK) {
    await delay()
    const next = MOCK_TOKENS.length + 1
    return {
      token_id: `TKN-2024-${String(next).padStart(3, '0')}`,
      tx_hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    }
  }
  return request<TokenIssueResponse>('/api/tokens', { method: 'POST', body: req })
}

export async function transferToken(req: TokenTransferRequest): Promise<TokenTransferResponse> {
  if (USE_MOCK) {
    await delay()
    return {
      tx_hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      transferred_at: new Date().toISOString(),
    }
  }
  return request<TokenTransferResponse>(`/api/tokens/${req.token_id}/transfer`, {
    method: 'POST',
    body: req,
  })
}

export async function getTokens(params: GetTokensParams = {}): Promise<GetTokensResponse> {
  if (USE_MOCK) {
    await delay(400)
    const { status = 'all', search = '' } = params
    const filtered = MOCK_TOKENS.filter(t => {
      if (status === 'normal' && t.status !== 'normal') return false
      if (status === 'flagged' && t.status !== 'flagged' && t.status !== 'at-risk') return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.id.toLowerCase().includes(q) && !t.owner.toLowerCase().includes(q)) return false
      }
      return true
    })
    return { items: filtered, total: filtered.length, page: params.page ?? 1, size: params.size ?? filtered.length }
  }
  return request<GetTokensResponse>('/api/tokens', { query: params as Record<string, string | number | undefined> })
}

/** Convenience: flat list, matches what the Token Monitoring page used to expect. */
export async function listTokens(params: GetTokensParams = {}): Promise<Token[]> {
  const res = await getTokens(params)
  return res.items
}
