import * as React from 'react'
import { cn } from '../../utils/cn'

export interface FileUploadProps {
  label?: string
  title: string
  description: string
  accept?: string
  maxSizeMB?: number
  value?: File | null
  onChange?: (file: File | null) => void
  error?: string
  className?: string
  /**
   * Optional external control of the upload status shown next to the icon.
   * If omitted, status is simulated internally: selecting a file shows a
   * spinner for `uploadDurationMs`, then switches to the success icon.
   * Pass this if you wire the component to a real upload request instead.
   */
  status?: 'idle' | 'uploading' | 'success'
  /** How long to show the simulated spinner before switching to success. Ignored if `status` is provided. */
  uploadDurationMs?: number
  /** Max character length for the displayed filename before it's truncated (middle-truncated, extension preserved). */
  filenameMaxLength?: number
}

/** Truncates a filename in the middle, preserving the file extension. */
function truncateMiddle(name: string, maxLength = 24): string {
  if (name.length <= maxLength) return name

  const dotIndex = name.lastIndexOf('.')
  const ext = dotIndex > -1 ? name.slice(dotIndex) : ''
  const base = dotIndex > -1 ? name.slice(0, dotIndex) : name

  const keep = maxLength - ext.length - 1 // -1 for the ellipsis char
  if (keep <= 0) return `…${ext}`.slice(0, maxLength)

  return `${base.slice(0, keep)}…${ext}`
}

function Spinner() {
  return (
    <svg
      className="text-warmGray h-3 w-3 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Uploading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export function FileUpload({
  label,
  title,
  description,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  value,
  onChange,
  error,
  className,
  status,
  uploadDurationMs = 1200,
  filenameMaxLength = 24,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internalStatus, setInternalStatus] = React.useState<'idle' | 'uploading' | 'success'>(
    'idle',
  )

  const resolvedStatus = status ?? internalStatus

  React.useEffect(() => {
    if (status !== undefined) return // externally controlled — skip simulation

    if (!value) {
      setInternalStatus('idle')
      return
    }

    setInternalStatus('uploading')
    const timer = setTimeout(() => setInternalStatus('success'), uploadDurationMs)
    return () => clearTimeout(timer)
  }, [value, status, uploadDurationMs])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      onChange?.(null)
      return
    }
    onChange?.(file)
  }

  function handleRemove() {
    onChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex w-full min-w-0 flex-col gap-2', className)}>
      {label && <span className="font-dmsans text-body-small text-gray-500">{label}</span>}

      <div
        className={cn(
          'flex w-full min-w-0 flex-col rounded-[12px] border border-black/10',
          error && 'border-red-400',
        )}
      >
        {/* Filename row — always at the very top of the card when a file is present */}
        {value && (
          <div className="flex w-full min-w-0 items-center gap-3 px-4 pt-3 pb-1">
            <span
              className="font-dmsans text-body-small text-actionDark min-w-0 flex-1 truncate font-medium"
              title={value.name}
            >
              {truncateMiddle(value.name, filenameMaxLength)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 px-4 py-4">
          {/* Icon, with status badge (spinner/success) overlaid at its corner */}
          <div className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-gray-100">
            <span className="material-symbols-outlined text-actionDark text-[20px]">id_card</span>

            {value && (resolvedStatus === 'uploading' || resolvedStatus === 'success') && (
              <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                {resolvedStatus === 'uploading' && <Spinner />}
                {resolvedStatus === 'success' && (
                  <img src="/assets/success-circle.svg" alt="Upload complete" className="h-4 w-4" />
                )}
              </span>
            )}
          </div>

          {/* Text */}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            {value ? (
              <span className="font-dmsans text-[11px] text-gray-400">
                {(value.size / 1024).toFixed(0)} KB
              </span>
            ) : (
              <>
                <span className="font-dmsans text-body-small text-actionDark font-medium">
                  {title}
                </span>
                <span className="font-dmsans text-[11px] leading-snug text-gray-400">
                  {description}
                </span>
              </>
            )}
          </div>

          {/* Action button */}
          {value ? (
            <button
              type="button"
              onClick={handleRemove}
              className="font-dmsans flex shrink-0 items-center gap-1 rounded-[8px] border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-100"
            >
              <span className="material-symbols-outlined text-[12px]">close</span>
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-actionDark font-dmsans hover:text-actionDark flex shrink-0 items-center gap-1 rounded-[8px] border border-black/10 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-gray-50"
            >
              <span className="material-symbols-outlined !text-[16px] transition-all duration-200">
                arrow_upward
              </span>
              Upload
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {error && <span className="font-dmsans text-[11px] text-red-500">{error}</span>}
    </div>
  )
}
