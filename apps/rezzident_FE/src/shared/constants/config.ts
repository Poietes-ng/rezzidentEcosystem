/** Base URL for the FastAPI backend */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000'

/** Application display name */
export const APP_NAME = 'Poietes'

/** Current environment */
export const ENVIRONMENT =
  (typeof import.meta !== 'undefined' && import.meta.env?.MODE) || 'development'
