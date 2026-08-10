/** Pixel color data from canvas inspection */
export interface PixelData {
  x: number
  y: number
  r: number
  g: number
  b: number
  a: number
  hex: string
}

/** Props for the PixelTracker canvas component */
export interface PixelTrackerProps {
  containerRef?: React.RefObject<HTMLElement>
}

/** Individual pixel state in the PixelTracker grid animation */
export interface Pixel {
  x: number
  y: number
  col: number
  row: number
  opacity: number
  targetOpacity: number
  scale: number
  targetScale: number
  color: string
  distFromCenter: number
}
