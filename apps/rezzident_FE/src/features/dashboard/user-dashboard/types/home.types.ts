export type VerificationState = 'unverified' | 'tier2' | 'verified'

export type AccountStatus = 'active' | 'deactivated'

export type QuickActionId = 'id' | 'alias' | 'vouch' | 'panic'

export type QuickActionTone = 'default' | 'danger'

export const QUICK_ACTION_ROUTES: Record<Exclude<QuickActionId, 'panic'>, string> = {
  id: '/_authenticated/profile',
  alias: '/_authenticated/profile',
  vouch: '/app/vouch',
}

export interface Resident {
  id: string
  firstName: string
  fullName: string
  verificationState: VerificationState
  accountStatus: AccountStatus
}

export interface PromoAd {
  id: string
  imageSrc: string
  alt: string
  href: string
  width?: number
  height?: number
}

export interface DashboardAds {
  topStrip: PromoAd
  midBanner: PromoAd
}

export interface PanicResult {
  securityContact: string
  timestamp: string
  date: string
}

export interface Activity {
  id: string
  title: string
  description?: string
  timestamp: string
}

export interface HowItWorksSlide {
  id: string
  title: string
  description: string
  illustration?: string
}

export type FeedbackRating =
  'very-dissatisfied' | 'dissatisfied' | 'neutral' | 'satisfied' | 'very-satisfied'

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export type AppUpdateStatus = 'idle' | 'loading' | 'success' | 'error'

export interface FeedbackRatingOption {
  id: FeedbackRating
  label: string
  imageSrc: string
}

export const FEEDBACK_RATING_OPTIONS: FeedbackRatingOption[] = [
  {
    id: 'very-dissatisfied',
    label: 'Very Dissatisfied',
    imageSrc: '/assets/Very_Dissatisfied.png',
  },
  {
    id: 'dissatisfied',
    label: 'Dissatisfied',
    imageSrc: '/assets/Dissatisfied.png',
  },
  {
    id: 'neutral',
    label: 'Neutral',
    imageSrc: '/assets/Neutral.png',
  },
  {
    id: 'satisfied',
    label: 'Satisfied',
    imageSrc: '/assets/Satisfied.png',
  },
  {
    id: 'very-satisfied',
    label: 'Very Satisfied',
    imageSrc: '/assets/Very_Satisfied.png',
  },
]
