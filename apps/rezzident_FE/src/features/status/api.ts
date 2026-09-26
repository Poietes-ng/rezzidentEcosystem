/**
 * System Status API — consumes /api/v1/status
 *
 * Matches the FastAPI routes in:
 *   api/v1/routes/status.py
 *   api/v1/services/status_service.py
 */
import { apiClient } from '#/shared/lib/apiClient'

// ── Types ──────────────────────────────────────────────────────────────────

export type ServiceStatus =
  'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'not_configured'

export interface ServiceCheck {
  name: string
  status: ServiceStatus
  response_time_ms: number | null
  description: string
  error?: string
}

export interface FullStatusReport {
  status: ServiceStatus
  overall_label: string
  timestamp: string
  uptime_seconds: number
  uptime_formatted: string
  environment: string
  services: ServiceCheck[]
}

export interface DailyUptimeEntry {
  date: string
  status: 'operational' | 'incident' | 'no_data'
  uptime_pct: number | null
  total_checks: number
  incident_checks: number
}

export interface IncidentRecord {
  id: string
  overall_status: ServiceStatus
  overall_label: string
  incident_services: string | null
  services: ServiceCheck[]
  occurred_at: string
}

export interface IncidentsResponse {
  days: number
  total_incidents: number
  incidents: IncidentRecord[]
}

interface ApiResponse<T> {
  status_code: number
  message: string
  data: T
}

// ── API calls ──────────────────────────────────────────────────────────────

export async function fetchFullStatus(token: string): Promise<FullStatusReport> {
  const res = await apiClient.get<ApiResponse<FullStatusReport>>('/api/v1/status', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export async function fetchDailySummary(token: string, days = 90): Promise<DailyUptimeEntry[]> {
  const res = await apiClient.get<ApiResponse<DailyUptimeEntry[]>>(
    `/api/v1/status/daily?days=${days}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}

export async function fetchIncidents(
  token: string,
  limit = 20,
  days = 30,
): Promise<IncidentsResponse> {
  const res = await apiClient.get<ApiResponse<IncidentsResponse>>(
    `/api/v1/status/incidents?limit=${limit}&days=${days}`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  return res.data
}
