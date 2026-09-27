/**
 * Activity Log API — consumes /api/v1/activity-logs
 *
 * Matches the FastAPI routes in:
 *   api/v1/routes/activity_log.py
 *   api/v1/services/activity_log_service.py
 */
import { apiClient } from '#/shared/lib/apiClient'

// ── Types ──────────────────────────────────────────────────────────────────

export interface ActivityLogItem {
  id: string
  timestamp: string
  user_name: string
  user_role: string | null
  activity_type: string
  action: string
  description: string
  target_type: string | null
  target_id: string | null
}

export interface ActivityLogDetail extends ActivityLogItem {
  user: {
    id: string
    full_name: string | null
    phone_number: string | null
    role: string
  } | null
  ip_address: string | null
  user_agent: string | null
  metadata: string | null
  created_at: string
}

export interface PaginatedActivityLogs {
  total: number
  pages: number
  current_page: number
  limit: number
  skip: number
  items: ActivityLogItem[]
}

export interface ActivitySummaryStats {
  total_activities: number
  activities_today: number
  activities_this_week: number
  activities_this_month: number
  top_activity_types: { type: string; count: number }[]
  most_active_users: { user_name: string; count: number }[]
}

interface ApiResponse<T> {
  status_code: number
  message: string
  data: T
}

export interface ActivityLogFilters {
  activity_type?: string
  user_id?: string
  date_from?: string
  date_to?: string
  search?: string
  limit?: number
  skip?: number
}

// ── API calls ──────────────────────────────────────────────────────────────

export async function fetchActivityLogs(
  filters: ActivityLogFilters = {},
  token: string,
): Promise<PaginatedActivityLogs> {
  const params = new URLSearchParams()
  if (filters.activity_type) params.set('activity_type', filters.activity_type)
  if (filters.user_id) params.set('user_id', filters.user_id)
  if (filters.date_from) params.set('date_from', filters.date_from)
  if (filters.date_to) params.set('date_to', filters.date_to)
  if (filters.search) params.set('search', filters.search)
  if (filters.limit != null) params.set('limit', String(filters.limit))
  if (filters.skip != null) params.set('skip', String(filters.skip))

  const query = params.toString() ? `?${params}` : ''
  const res = await apiClient.get<ApiResponse<PaginatedActivityLogs>>(
    `/api/v1/activity-logs${query}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}

export async function fetchActivitySummary(token: string): Promise<ActivitySummaryStats> {
  const res = await apiClient.get<ApiResponse<ActivitySummaryStats>>(
    '/api/v1/activity-logs/summary',
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}

export async function fetchActivityDetail(id: string, token: string): Promise<ActivityLogDetail> {
  const res = await apiClient.get<ApiResponse<ActivityLogDetail>>(`/api/v1/activity-logs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
