import type { Business, Member, Schedule, Session, Stats } from './types'

// In dev: empty string (Vite proxy handles /api → localhost:3500)
// In production build: points to Render backend
const BASE = import.meta.env.VITE_API_BASE ?? ''

let _token = ''

export function setToken(t: string) {
  _token = t
}

function headers(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_token) h['x-admin-token'] = _token
  return h
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + url, { ...options, headers: headers() })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Auth
export function login(wabaId: string, password: string) {
  return request<{ ok: boolean; wabaId: string; token: string; businesses: Business[] }>(
    '/api/login',
    { method: 'POST', body: JSON.stringify({ wabaId, password }) }
  )
}

// Businesses
export function getBusinesses(wabaId: string) {
  return request<Business[]>(`/api/businesses?wabaId=${encodeURIComponent(wabaId)}`)
}

export function getBusiness(id: string) {
  return request<Business>(`/api/business/${id}`)
}

export function updateBusiness(id: string, data: Partial<Business>) {
  return request<Business>(`/api/business/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function addMedia(id: string, asset: { key: string; label?: string; type: string; url: string; caption?: string }) {
  return request<Business>(`/api/business/${id}/media`, { method: 'POST', body: JSON.stringify(asset) })
}

export function deleteMedia(id: string, key: string) {
  return request<Business>(`/api/business/${id}/media/${encodeURIComponent(key)}`, { method: 'DELETE' })
}

// Stats
export function getStats(businessId: string) {
  return request<Stats>(`/api/stats?businessId=${encodeURIComponent(businessId)}`)
}

// Members
export function getMembers(businessId: string) {
  return request<Member[]>(`/api/members?businessId=${encodeURIComponent(businessId)}`)
}

export function createMember(data: Omit<Member, '_id'>) {
  return request<Member>('/api/members', { method: 'POST', body: JSON.stringify(data) })
}

export function updateMember(id: string, data: Partial<Member>) {
  return request<Member>(`/api/members/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteMember(id: string) {
  return request<{ ok: boolean }>(`/api/members/${id}`, { method: 'DELETE' })
}

// Schedules
export function getSchedules(businessId: string) {
  return request<Schedule[]>(`/api/schedules?businessId=${encodeURIComponent(businessId)}`)
}

export function createSchedule(data: Omit<Schedule, '_id'>) {
  return request<Schedule>('/api/schedules', { method: 'POST', body: JSON.stringify(data) })
}

export function updateSchedule(id: string, data: Partial<Schedule>) {
  return request<Schedule>(`/api/schedules/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteSchedule(id: string) {
  return request<{ ok: boolean }>(`/api/schedules/${id}`, { method: 'DELETE' })
}

// Sessions
export function getSessions(businessId: string) {
  return request<Session[]>(`/api/sessions?businessId=${encodeURIComponent(businessId)}`)
}

export function deleteSession(id: string) {
  return request<{ ok: boolean }>(`/api/sessions/${id}`, { method: 'DELETE' })
}

export function clearSessions(businessId: string) {
  return request<{ deleted: number }>(`/api/sessions?businessId=${encodeURIComponent(businessId)}`, { method: 'DELETE' })
}

// Bot flags for hardcoded bots (Flownware, Real Estate)
export function getBotFlags() {
  return request<{ flownware: boolean; realestate: boolean }>('/api/bot-flags')
}
export function activateBotFlag(botId: string) {
  return request<{ botId: string; active: boolean }>(`/api/bot-flags/${botId}/activate`, { method: 'POST', body: JSON.stringify({}) })
}
export function deactivateBotFlag(botId: string) {
  return request<{ botId: string; active: boolean }>(`/api/bot-flags/${botId}/deactivate`, { method: 'POST', body: JSON.stringify({}) })
}

export function pauseSession(id: string) {
  return request<import('./types').Session>(`/api/sessions/${id}/pause`, { method: 'PATCH', body: JSON.stringify({}) })
}

export function resumeSession(id: string) {
  return request<import('./types').Session>(`/api/sessions/${id}/resume`, { method: 'PATCH', body: JSON.stringify({}) })
}

// Upload file to Cloudinary via backend — returns { url, type }
export async function uploadFile(file: File): Promise<{ url: string; type: 'image' | 'video' }> {
  const form = new FormData()
  form.append('file', file)
  // Do NOT set Content-Type — browser adds multipart boundary automatically
  const res = await fetch(BASE + '/api/upload', {
    method: 'POST',
    headers: _token ? { 'x-admin-token': _token } : {},
    body: form,
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  return res.json()
}

// Activate one business, deactivate all others under same WABA
export function activateBusiness(id: string) {
  return request<{ activated: string; businesses: Business[] }>(
    `/api/business/${id}/activate`,
    { method: 'POST', body: JSON.stringify({}) }
  )
}

// Deactivate a single business only
export function deactivateBusiness(id: string) {
  return request<{ deactivated: string; businesses: Business[] }>(
    `/api/business/${id}/deactivate`,
    { method: 'POST', body: JSON.stringify({}) }
  )
}
