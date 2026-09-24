import { apiClient } from '#/shared/lib/apiClient'

/* ── Types ── */

export interface StakeholderPayload {
  full_name: string
  phone_number: string
  email: string
  role_title: string
  is_primary: boolean
}

export interface EstateRegisterPayload {
  name: string
  address: string
  state: string
  local_government: string
  management_type: string
  structure_template_id?: string | null
  number_of_units?: number | null
  settlement_account_number?: string | null
  settlement_bank_name?: string | null
  settlement_account_name?: string | null
  stakeholders?: StakeholderPayload[]
}

export interface EstateRegisterResponse {
  status: boolean
  status_code: number
  message: string
  data: {
    id: string
    estate_code: string
    schema_name: string
    name: string
    address: string
    city: string | null
    state: string | null
    management_type: string
    status: string
    onboarding_step: string
  }
}

export interface StructureTemplate {
  template_id: string
  name: string
  description: string
  category: string
  levels: { level: number; label: string; type: string; required: boolean }[]
  address_format: string
  structure: string
  example_address: string
}

export interface StructureTemplatesResponse {
  status: boolean
  status_code: number
  message: string
  data: StructureTemplate[]
}

/* ── API Calls ── */

/**
 * Register a new estate — creates per-tenant schema + record.
 * POST /api/v1/estates/register
 */
export function registerEstate(payload: EstateRegisterPayload): Promise<EstateRegisterResponse> {
  return apiClient.post<EstateRegisterResponse>('/api/v1/estates/register', payload)
}

/**
 * Fetch available estate structure templates from seed data.
 * GET /api/v1/estates/structure-templates
 */
export function fetchStructureTemplates(levels?: number): Promise<StructureTemplatesResponse> {
  const params = levels != null ? `?levels=${levels}` : ''
  return apiClient.get<StructureTemplatesResponse>(`/api/v1/estates/structure-templates${params}`)
}
