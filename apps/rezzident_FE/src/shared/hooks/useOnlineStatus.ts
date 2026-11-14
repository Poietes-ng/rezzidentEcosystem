import { useSyncExternalStore } from 'react'

function subscribeOnlineStatus(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

function getOnlineSnapshot(): boolean {
  if (typeof navigator === 'undefined') {
    return true
  }
  return navigator.onLine
}

function getServerOnlineSnapshot(): boolean {
  return true
}

export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribeOnlineStatus, getOnlineSnapshot, getServerOnlineSnapshot)
}
