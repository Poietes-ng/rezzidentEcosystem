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
