// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Activity } from '#/features/dashboard/user-dashboard/types/home.types'
import { RecentActivities } from '#/features/dashboard/user-dashboard/components/RecentActivities'

describe('RecentActivities', () => {
  const mockActivities: Activity[] = [
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
  ]

  it('renders loading state without activity rows', () => {
    const { container } = render(<RecentActivities isLoading={true} />)

    expect(screen.getByText('Recent activities')).toBeDefined()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
    expect(screen.queryByText('No activity yet.')).toBeNull()
  })

  it('renders empty state when activities array is empty', () => {
    render(<RecentActivities activities={[]} isLoading={false} />)

    expect(screen.getByText('No activity yet.')).toBeDefined()
    expect(screen.getByText('Your recent actions will appear here.')).toBeDefined()
  })

  it('renders populated state with formatted dates and truncated titles', () => {
    render(<RecentActivities activities={mockActivities} isLoading={false} />)

    expect(
      screen.getByText('Payment for estate security fee and general amenities maintenance'),
    ).toBeDefined()
    expect(screen.getByText('Visitor Scheduling for Veronica James')).toBeDefined()

    // 27 Jul, 2:34PM or similar formatted date
    expect(screen.getAllByText(/27 Jul/i).length).toBe(2)
  })

  it('renders error state with retry button and calls onRetry when clicked', () => {
    const handleRetry = vi.fn()
    render(<RecentActivities isError={true} onRetry={handleRetry} isLoading={false} />)

    expect(screen.getByText('Failed to load activities')).toBeDefined()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)

    expect(handleRetry).toHaveBeenCalledTimes(1)
  })

  it('fires onActivityClick when an activity row is clicked', () => {
    const handleClick = vi.fn()
    render(
      <RecentActivities
        activities={mockActivities}
        isLoading={false}
        onActivityClick={handleClick}
      />,
    )

    const row = screen.getByText('Visitor Scheduling for Veronica James')
    fireEvent.click(row)

    expect(handleClick).toHaveBeenCalledWith(mockActivities[1])
  })
})
