/**
 * Cloudinary CDN asset helper.
 *
 * Usage:
 *   import { cdnUrl, cdnImage } from '#/shared/lib/cdn'
 *
 *   // Simple URL builder
 *   <img src={cdnUrl('poioteslogo.svg')} />
 *
 *   // With Cloudinary transformations (resize, format, quality)
 *   <img src={cdnImage('mascot.png', { w: 400, h: 400, q: 'auto', f: 'auto' })} />
 */

const CDN_BASE = import.meta.env.VITE_CDN_URL as string | undefined

/**
 * Returns the full CDN URL for a given asset path.
 * Falls back to the local `/assets/` path during development when VITE_CDN_URL is not set.
 */
export function cdnUrl(path: string): string {
  if (!CDN_BASE) {
    // In dev or when no CDN is configured, serve from local assets
    return `/assets/${path}`
  }
  // Trim trailing slash from base and leading slash from path
  const base = CDN_BASE.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  return `${base}/${cleanPath}`
}

/**
 * Cloudinary-specific transformation options.
 */
interface CloudinaryTransformOptions {
  /** Width in pixels */
  w?: number
  /** Height in pixels */
  h?: number
  /** Crop mode: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop' */
  c?: 'fill' | 'fit' | 'scale' | 'thumb' | 'crop'
  /** Quality: 'auto' | number (1-100) */
  q?: 'auto' | number
  /** Format: 'auto' | 'webp' | 'avif' | 'png' | 'jpg' */
  f?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg'
  /** Gravity for cropping: 'auto' | 'face' | 'center' */
  g?: 'auto' | 'face' | 'center'
  /** Device pixel ratio: 'auto' | number */
  dpr?: 'auto' | number
}

/**
 * Builds a Cloudinary URL with on-the-fly transformations.
 * When no CDN is configured, returns the plain local path (transformations are ignored).
 *
 * Example:
 *   cdnImage('mascot.png', { w: 400, f: 'auto', q: 'auto' })
 *   → https://res.cloudinary.com/your-cloud/image/upload/w_400,f_auto,q_auto/v1/poietes/mascot.png
 */
export function cdnImage(
  path: string,
  transforms?: CloudinaryTransformOptions,
): string {
  if (!CDN_BASE || !transforms) {
    return cdnUrl(path)
  }

  // Build Cloudinary transformation string
  const parts: string[] = []
  if (transforms.w) parts.push(`w_${transforms.w}`)
  if (transforms.h) parts.push(`h_${transforms.h}`)
  if (transforms.c) parts.push(`c_${transforms.c}`)
  if (transforms.q) parts.push(`q_${transforms.q}`)
  if (transforms.f) parts.push(`f_${transforms.f}`)
  if (transforms.g) parts.push(`g_${transforms.g}`)
  if (transforms.dpr) parts.push(`dpr_${transforms.dpr}`)

  if (parts.length === 0) {
    return cdnUrl(path)
  }

  // Cloudinary URL structure:
  // https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<path>
  // We expect CDN_BASE to be set up to the upload/ part, e.g.:
  //   VITE_CDN_URL=https://res.cloudinary.com/mycloud/image/upload/v1/poietes
  // The transform string goes BEFORE the version/folder part.
  // So we split on '/upload/' and inject transforms.
  const uploadMarker = '/upload/'
  const idx = CDN_BASE.indexOf(uploadMarker)

  if (idx !== -1) {
    const before = CDN_BASE.slice(0, idx + uploadMarker.length)
    const after = CDN_BASE.slice(idx + uploadMarker.length).replace(/\/+$/, '')
    const cleanPath = path.replace(/^\/+/, '')
    return `${before}${parts.join(',')}/${after}/${cleanPath}`
  }

  // If CDN_BASE doesn't follow the Cloudinary /upload/ convention,
  // just append transforms as a query param fallback
  return cdnUrl(path)
}
