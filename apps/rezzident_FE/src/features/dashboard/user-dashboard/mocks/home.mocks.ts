import type {
  AccountStatus,
  Activity,
  DashboardAds,
  HowItWorksSlide,
  PanicResult,
  Resident,
  VerificationState,
} from '#/features/dashboard/user-dashboard/types/home.types'

/**
 * Change this value to 'unverified', 'tier2', or 'verified'
 * to preview different resident states on the Home dashboard.
 */
export const ACTIVE_VERIFICATION_STATE: VerificationState = 'unverified'

/**
 * Change this value to 'active' or 'deactivated' to preview
 * the deactivated account state on the Home dashboard.
 */
export const ACTIVE_ACCOUNT_STATUS: AccountStatus = 'active'

/**
 * Change this value to 'empty' or 'populated' to preview
 * empty vs populated states of Recent Activities.
 */
export const ACTIVE_ACTIVITIES_STATE: 'empty' | 'populated' = 'populated'

/**
 * Change this value to true to preview the
 * "See how Rezzident works" modal open on load.
 */
export const MOCK_HOW_IT_WORKS_OPEN = false as boolean

/**
 * Change this value to true to preview the
 * "New Update Available" modal open on load.
 */
export const MOCK_UPDATE_OPEN = false as boolean

/**
 * Change this value to true to preview the
 * "User Feedback" modal open on load.
 */
export const MOCK_FEEDBACK_OPEN = false as boolean

/**
 * Change this value to true to simulate feedback submission failure.
 */
export const MOCK_FEEDBACK_ERROR = false as boolean

/**
 * Change this value to true to simulate update installation failure.
 */
export const MOCK_UPDATE_ERROR = false as boolean

export const mockResident: Resident = {
  id: 'res-001',
  firstName: 'Mamah',
  fullName: 'Mamah Valentine Obumneme',
  verificationState: ACTIVE_VERIFICATION_STATE,
  accountStatus: ACTIVE_ACCOUNT_STATUS,
}

export const mockDashboardAds: DashboardAds = {
  topStrip: {
    id: 'ad-top-iphones',
    imageSrc: '/assets/promo-top-strip.svg',
    alt: 'Pre-Owned iPhones - Premium Quality Guaranteed',
    href: 'https://example.com/promotions/iphones',
    width: 393,
    height: 60,
  },
  midBanner: {
    id: 'ad-mid-eufycam',
    imageSrc: '/assets/promo-mid-banner.svg',
    alt: '2K MaxColor Vision, Solar-Powered eufyCam S40 - Buy Now',
    href: 'https://example.com/promotions/eufycam',
    width: 345,
    height: 100,
  },
}

export const mockPanicResult: PanicResult = {
  securityContact: '+234 803 456 7890',
  timestamp: '3:24AM',
  date: '9 Jul, 2026',
}

export const mockRecentActivities: Activity[] = [
  {
    id: 'act-001',
    title: 'Payment for estate security fee and general amenities maintenance',
    timestamp: '2026-07-27T14:34:00.000Z',
  },
  {
    id: 'act-002',
    title: 'Visitor Scheduling for Veronica James',
    timestamp: '2026-07-27T14:34:00.000Z',
  },
  {
    id: 'act-003',
    title: 'Payment for estate security fee',
    timestamp: '2026-07-27T14:34:00.000Z',
  },
  {
    id: 'act-004',
    title: 'Payment for estate security fee',
    timestamp: '2026-07-27T14:34:00.000Z',
  },
]

export const mockHowItWorksSlides: HowItWorksSlide[] = [
  {
    id: 'visitor-code',
    title: 'Visitor Code',
    description: 'Generate secure visitor codes for your visitors.',
  },
  {
    id: 'bills',
    title: 'Bills',
    description: 'View and pay your estate bills securely from one place.',
  },
  {
    id: 'alias',
    title: 'Alias',
    description: 'Create and manage trusted accounts for members of your household.',
  },
  {
    id: 'panic',
    title: 'Panic',
    description: 'Alert estate security instantly during emergencies.',
  },
  {
    id: 'vouch',
    title: 'Vouch',
    description: 'Help trusted neighbors join your estate community securely.',
  },
  {
    id: 'vote',
    title: 'Vote',
    description: 'Participate in secure and transparent estate voting.',
  },
  {
    id: 'id',
    title: 'ID',
    description: 'Verify your identity and confirm your residency within the estate.',
  },
  {
    id: 'forum',
    title: 'Forum',
    description: 'Join community discussions and stay connected with fellow residents.',
  },
]
