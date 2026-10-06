import type {
  Activity,
  DashboardAds,
  FeedbackRating,
  PanicResult,
  Resident,
} from '#/features/dashboard/user-dashboard/types/home.types'
import {
  ACTIVE_ACTIVITIES_STATE,
  MOCK_FEEDBACK_ERROR,
  MOCK_UPDATE_ERROR,
  mockDashboardAds,
  mockPanicResult,
  mockRecentActivities,
  mockResident,
} from '#/features/dashboard/user-dashboard/mocks/home.mocks'

export async function getResident(): Promise<Resident> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return mockResident
}

export async function getDashboardAds(): Promise<DashboardAds> {
  return mockDashboardAds
}

export async function triggerPanic(): Promise<PanicResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return mockPanicResult
}

export async function getRecentActivities(): Promise<Activity[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return ACTIVE_ACTIVITIES_STATE === 'empty' ? [] : mockRecentActivities
}

export async function submitFeedback(_rating: FeedbackRating): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (MOCK_FEEDBACK_ERROR) {
    throw new Error('Failed to submit feedback. Please try again.')
  }
  return { success: true }
}

export async function startAppUpdate(): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (MOCK_UPDATE_ERROR) {
    throw new Error('Failed to update app. Please check your connection and try again.')
  }
  return { success: true }
}
