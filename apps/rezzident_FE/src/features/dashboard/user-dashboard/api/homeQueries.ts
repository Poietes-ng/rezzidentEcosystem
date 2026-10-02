import type {
  Activity,
  DashboardAds,
  PanicResult,
  Resident,
} from '#/features/dashboard/user-dashboard/types/home.types'
import {
  ACTIVE_ACTIVITIES_STATE,
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
