import { cn } from '../../utils/cn'

export type MessageBubbleProps = {
  content: string
  timestamp: string
  variant: 'sender' | 'receiver'
  isDeleted?: boolean
  isVoiceNote?: boolean
  voiceDuration?: string
  isPlaying?: boolean
  onPlayPause?: () => void
  readStatus?: 'sent' | 'delivered' | 'read'
  className?: string
}

export function MessageBubble({
  content,
  timestamp,
  variant,
  isDeleted = false,
  isVoiceNote = false,
  voiceDuration,
  isPlaying = false,
  onPlayPause,
  readStatus,
  className,
}: MessageBubbleProps) {
  const isSender = variant === 'sender'

  if (isDeleted) {
    return (
      <div
        className={cn(
          'flex max-w-[75%] items-center gap-2 rounded-2xl px-4 py-2.5',
          isSender ? 'bg-deletedBubble ml-auto' : 'bg-deletedBubble mr-auto',
          className,
        )}
      >
        <span className="material-symbols-outlined text-[18px] text-gray-400">block</span>
        <span className="text-body-small text-gray-400 italic">This message was deleted</span>
      </div>
    )
  }

  if (isVoiceNote) {
    return (
      <div
        className={cn(
          'flex max-w-[85%] items-center gap-3 px-3.5 py-2.5',
          isSender
            ? 'bg-actionDark ml-auto rounded-2xl rounded-br-sm text-white'
            : 'bg-receiverBubble text-actionDark mr-auto rounded-2xl rounded-bl-sm',
          className,
        )}
      >
        <button
          onClick={onPlayPause}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isSender ? 'bg-white/20' : 'bg-actionDark/10',
          )}
        >
          <span
            className={cn(
              'material-symbols-outlined text-[18px]',
              isSender ? 'text-white' : 'text-actionDark',
            )}
          >
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Waveform bars */}
        <div className="flex flex-1 items-center gap-0.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={cn('w-0.75 rounded-full', isSender ? 'bg-white/50' : 'bg-actionDark/30')}
              style={{ height: `${Math.max(4, Math.random() * 16)}px` }}
            />
          ))}
        </div>

        <span className={cn('text-caption shrink-0', isSender ? 'text-white/60' : 'text-gray-400')}>
          {voiceDuration || '0:00'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex max-w-[85%] flex-col px-3.5 py-2.5',
        isSender
          ? 'bg-actionDark ml-auto rounded-2xl rounded-br-sm text-white'
          : 'bg-receiverBubble text-actionDark mr-auto rounded-2xl rounded-bl-sm',
        className,
      )}
    >
      <p className="text-left text-[15px] leading-relaxed">{content}</p>
      <div
        className={cn(
          'mt-2 flex items-center justify-start gap-1.5',
          isSender ? 'text-white/60' : 'text-gray-500',
        )}
      >
        <span className="text-[13px]">{timestamp}</span>
        {isSender && readStatus && (
          <span
            className={cn(
              'material-symbols-outlined text-[16px]',
              readStatus === 'read' ? 'text-[#25D366]' : 'text-white/60',
            )}
          >
            {readStatus === 'read' ? 'done_all' : readStatus === 'delivered' ? 'done_all' : 'check'}
          </span>
        )}
      </div>
    </div>
  )
}
