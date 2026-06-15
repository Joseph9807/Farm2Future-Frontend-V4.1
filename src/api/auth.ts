// =====================================================================
// 1. Auth — POST /api/auth/login
// =====================================================================

import { USE_MOCK, request, delay, ApiClientError } from './client'
import { MOCK_USERS } from './__mocks__'
import type { LoginRequest, LoginResponse } from '@/types/api'

export async function login(req: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) {
    await delay()
    const user = MOCK_USERS[req.role]
    if (!user) throw new ApiClientError(404, 'USER_NOT_FOUND', `No mock user for role ${req.role}`)
    if (!req.email || !req.password) {
      throw new ApiClientError(400, 'INVALID_CREDENTIALS', 'Email and password are required')
    }
    return { user, token: `mock-token-${user.id}-${Date.now()}` }
  }
  return request<LoginResponse>('/api/auth/login', { method: 'POST', body: req })
}
