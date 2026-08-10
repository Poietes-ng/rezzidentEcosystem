/** Standard API response envelope — mirrors the FastAPI response shape */
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

/** Paginated list response */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
