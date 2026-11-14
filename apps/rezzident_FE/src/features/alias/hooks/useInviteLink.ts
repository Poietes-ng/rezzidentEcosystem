import { useCallback, useEffect, useRef, useState } from 'react'
import { INVITE_LINK_BASE_URL } from '../constants/inviteLink'
import { copyToClipboard } from '../utils/copyToClipboard'

export interface UseInviteLinkOptions {
  code: string
  isExpired: boolean
  showToast: (message: string, variant: 'success' | 'error') => void
}

export interface UseInviteLinkReturn {
  copied: boolean
  isSharing: boolean
  handleCopy: () => Promise<void>
  handleShare: () => Promise<void>
}

/**
 * Manages copy and share actions for an alias invite link.
 * - Single timer for "Copied" feedback (~2s)
 * - Safe clipboard fallback
 * - Web Share API with graceful cancellation and clipboard fallback
 * - Duplicate press protection
 */
export function useInviteLink({
  code,
  isExpired,
  showToast,
}: UseInviteLinkOptions): UseInviteLinkReturn {
  const [copied, setCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const isBusyRef = useRef(false)
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getFullUrl = useCallback(() => {
    return `${INVITE_LINK_BASE_URL}${code}`
  }, [code])

  const handleCopy = useCallback(async (): Promise<void> => {
    if (isExpired) return
    if (isBusyRef.current) return
    isBusyRef.current = true

    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current)
      copiedTimerRef.current = null
    }

    const fullUrl = getFullUrl()
    const success = await copyToClipboard(fullUrl)

    if (success) {
      setCopied(true)
      showToast('Link Copied', 'success')
      copiedTimerRef.current = setTimeout(() => {
        setCopied(false)
        copiedTimerRef.current = null
      }, 2000)
    } else {
      showToast('Copy Failed', 'error')
    }

    isBusyRef.current = false
  }, [isExpired, getFullUrl, showToast])

  const handleShare = useCallback(async (): Promise<void> => {
    if (isExpired) return
    if (isBusyRef.current) return
    isBusyRef.current = true
    setIsSharing(true)

    const fullUrl = getFullUrl()

    if (
      typeof window !== 'undefined' &&
      typeof navigator !== 'undefined' &&
      typeof navigator.share === 'function'
    ) {
      try {
        await navigator.share({
          title: 'Household Alias Invite',
          text: 'Join my household on Rezzident using this alias link:',
          url: fullUrl,
        })
      } catch (err: unknown) {
        // AbortError indicates user dismissed the share sheet without completing
        const isAbort =
          err instanceof Error && (err.name === 'AbortError' || err.message.includes('AbortError'))
        if (!isAbort) {
          // Other failures fall back to copying to clipboard
          isBusyRef.current = false
          setIsSharing(false)
          await handleCopy()
          return
        }
      }
    } else {
      // Web Share API not supported, fall back to clipboard copy
      isBusyRef.current = false
      setIsSharing(false)
      await handleCopy()
      return
    }

    setIsSharing(false)
    isBusyRef.current = false
  }, [isExpired, getFullUrl, handleCopy])

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current)
      }
    }
  }, [])

  return {
    copied,
    isSharing,
    handleCopy,
    handleShare,
  }
}
