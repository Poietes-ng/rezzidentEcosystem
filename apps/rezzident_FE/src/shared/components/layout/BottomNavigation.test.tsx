// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { NavTab } from '#/shared/components/layout/BottomNavigation'
import { BottomNavigation } from '#/shared/components/layout/BottomNavigation'

// Mock TanStack Router useRouterState
vi.mock('@tanstack/react-router', () => ({
  useRouterState: () => ({
    location: { pathname: '/user-dashboard' },
  }),
  Link: ({
    children,
    to,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    to: string
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

describe('BottomNavigation', () => {
  it('renders five labeled items', () => {
    render(<BottomNavigation />)

    expect(screen.getByText('Home')).toBeDefined()
    expect(screen.getByText('Bills')).toBeDefined()
    expect(screen.getByText('Forum')).toBeDefined()
    expect(screen.getByText('Vote')).toBeDefined()
    expect(screen.getByText('Settings')).toBeDefined()
  })

  it('sets aria-current="page" on the active route item (Home on /user-dashboard)', () => {
    render(<BottomNavigation />)

    const homeTab = screen.getByRole('link', { name: 'Home' })
    expect(homeTab.getAttribute('aria-current')).toBe('page')

    const billsTab = screen.getByRole('link', { name: 'Bills' })
    expect(billsTab.getAttribute('aria-current')).toBeNull()
  })

  it('navigates when "to" is set and triggers onTabClick', () => {
    const handleTabClick = vi.fn()
    render(<BottomNavigation onTabClick={handleTabClick} />)

    const homeTab = screen.getByRole('link', { name: 'Home' })
    expect(homeTab.getAttribute('href')).toBe('/user-dashboard')

    fireEvent.click(homeTab)
    expect(handleTabClick).toHaveBeenCalledWith('home')
  })

  it('pressing an item without "to" does nothing and does not throw', () => {
    const handleTabClick = vi.fn()
    const tabsWithoutTo: NavTab[] = [
      { id: 'home', label: 'Home', icon: 'home', to: '/user-dashboard' },
      { id: 'bills', label: 'Bills', icon: 'payments' },
    ]
    render(<BottomNavigation tabs={tabsWithoutTo} onTabClick={handleTabClick} />)

    const billsTab = screen.getByRole('button', { name: 'Bills' })
    expect(() => fireEvent.click(billsTab)).not.toThrow()
    expect(handleTabClick).toHaveBeenCalledWith('bills')
  })

  it('disables items when disabled is true and sets aria-disabled without responding to clicks', () => {
    const handleTabClick = vi.fn()
    const customTabs: NavTab[] = [
      { id: 'home', label: 'Home', icon: 'home', to: '/user-dashboard' },
      { id: 'bills', label: 'Bills', icon: 'payments' },
      { id: 'forum', label: 'Forum', icon: 'group_work', disabled: true },
      { id: 'vote', label: 'Vote', icon: 'how_to_vote', disabled: true },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ]

    render(<BottomNavigation tabs={customTabs} onTabClick={handleTabClick} />)

    const forumTab = screen.getByRole('button', { name: 'Forum' })
    const voteTab = screen.getByRole('button', { name: 'Vote' })

    expect(forumTab.getAttribute('aria-disabled')).toBe('true')
    expect(forumTab.hasAttribute('disabled')).toBe(true)

    expect(voteTab.getAttribute('aria-disabled')).toBe('true')
    expect(voteTab.hasAttribute('disabled')).toBe(true)

    fireEvent.click(forumTab)
    fireEvent.click(voteTab)

    expect(handleTabClick).not.toHaveBeenCalled()
  })
})
