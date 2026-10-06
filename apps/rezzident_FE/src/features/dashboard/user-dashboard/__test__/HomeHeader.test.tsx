// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Resident } from '#/features/dashboard/user-dashboard/types/home.types'
import { HomeHeader } from '#/features/dashboard/user-dashboard/components/HomeHeader'

describe('HomeHeader', () => {
  const mockResident: Resident = {
    id: 'res-001',
    firstName: 'Mamah',
    fullName: 'Mamah Valentine Obumneme',
    verificationState: 'unverified',
    accountStatus: 'active',
  }

  it('renders real interactive icons and greeting skeletons while loading', () => {
    const handleSupport = vi.fn()
    const handleNotifications = vi.fn()
    const { container } = render(
      <HomeHeader
        isLoading={true}
        onSupportClick={handleSupport}
        onNotificationsClick={handleNotifications}
      />,
    )

    // Skeletons for greeting
    expect(screen.getByText('Loading resident profile')).toBeDefined()
    expect(container.querySelectorAll('.motion-safe\\:animate-pulse').length).toBe(2)

    // Real interactive icons are present immediately
    const supportBtn = screen.getByRole('button', { name: 'Customer support' })
    const notifBtn = screen.getByRole('button', { name: 'Notifications' })
    expect(supportBtn).toBeDefined()
    expect(notifBtn).toBeDefined()

    fireEvent.click(supportBtn)
    expect(handleSupport).toHaveBeenCalledTimes(1)

    fireEvent.click(notifBtn)
    expect(handleNotifications).toHaveBeenCalledTimes(1)
  })

  it('renders loaded resident name with two-line wrap and real action buttons', () => {
    render(<HomeHeader resident={mockResident} isLoading={false} />)

    expect(screen.getByText('Hello, Mamah')).toBeDefined()
    expect(screen.getByText('Valentine Obumneme')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Customer support' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeDefined()
  })
})
