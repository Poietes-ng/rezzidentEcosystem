import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Same className-merging helper as the web app
 * (rezzident_FE/src/shared/utils/cn.ts) — works identically here because
 * NativeWind resolves `className` strings through the same Tailwind engine.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
