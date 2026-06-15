// =====================================================================
// API Client — thin fetch wrapper + USE_MOCK toggle.
//
// When USE_MOCK is true (default in development), the per-endpoint
// functions in src/api/*.ts return mock data directly. Flip it to
// false (or set VITE_USE_MOCK=false) and they will hit the real
// backend at VITE_API_BASE_URL.
//
// To wire up to Yin Sizhe's backend later:
//   1. Set VITE_API_BASE_URL=http://localhost:8000 in .env.local
//   2. Set VITE_USE_MOCK=false (or flip the constant below)
//   3. No Vue component changes required.
// =====================================================================

import type { ApiErrorResponse } from '@/types/api'

/** When true, every api/* function returns the in-memory mock data. */
export const USE_MOCK: boolean = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true'

/** Base URL of the real backend. Only used when USE_MOCK is false. */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000'

/** Simulated network latency for mock responses (ms). */
export const MOCK_LATENCY_MS = 600

/** Helper: simulate latency in mock mode. */
export function delay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Custom error class so pages can `catch (err)` uniformly. */
export class ApiClientError extends Error {
  public readonly code: string
  public readonly status: number
  public readonly details?: Record<string, unknown>

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
    this.details = details
  }
}

/** Low-level fetch wrapper. Throws ApiClientError on non-2xx. */
export async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const { method = 'GET', body, query } = options

  const url = new URL(path.startsWith('http') ? path : `${API_BASE_URL}${path}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v))
    }
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('auth_token')
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let payload: ApiErrorResponse | undefined
    try { payload = (await res.json()) as ApiErrorResponse } catch { /* non-JSON error */ }
    throw new ApiClientError(
      res.status,
      payload?.error?.code ?? 'UNKNOWN_ERROR',
      payload?.error?.message ?? res.statusText,
      payload?.error?.details,
    )
  }

  // 204 No Content
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}
