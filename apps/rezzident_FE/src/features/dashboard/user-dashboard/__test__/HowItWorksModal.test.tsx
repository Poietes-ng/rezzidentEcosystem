// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { HowItWorksModal } from '#/features/dashboard/user-dashboard/components/HowItWorksModal'
import { mockHowItWorksSlides } from '#/features/dashboard/user-dashboard/mocks/home.mocks'
import { useHowItWorks } from '#/features/dashboard/user-dashboard/hooks/useHowItWorks'

describe('HowItWorksModal', () => {
  it('has 8 slides in mock data with correct titles in exact order', () => {
    expect(mockHowItWorksSlides.length).toBe(8)
    const titles = mockHowItWorksSlides.map((s) => s.title)
    expect(titles).toEqual([
      'Visitor Code',
      'Bills',
      'Alias',
      'Panic',
      'Vouch',
      'Vote',
      'ID',
      'Forum',
    ])
  })

  it('renders nothing when open is false', () => {
    render(
      <HowItWorksModal
        open={false}
        currentIndex={0}
        slides={mockHowItWorksSlides}
        onNext={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('opens at slide 1 with correct title, description, and active progress segment', () => {
    render(
      <HowItWorksModal
        open={true}
        currentIndex={0}
        slides={mockHowItWorksSlides}
        onNext={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByText('See how Rezzident works')).toBeDefined()
    expect(screen.getByText('Visitor Code')).toBeDefined()
    expect(screen.getByText('Generate secure visitor codes for your visitors.')).toBeDefined()
    expect(screen.getByText('Step 1 of 8')).toBeDefined()
  })

  it('advances through slides when Got It is clicked and closes on last slide', () => {
    function TestFlow() {
      const { open, currentIndex, slides, next, close } = useHowItWorks(true)
      return (
        <HowItWorksModal
          open={open}
          currentIndex={currentIndex}
          slides={slides}
          onNext={next}
          onClose={close}
        />
      )
    }

    render(<TestFlow />)

    // Slide 1: Visitor Code
    expect(screen.getByText('Visitor Code')).toBeDefined()
    expect(screen.getByText('Step 1 of 8')).toBeDefined()

    // Click Got It -> Slide 2: Bills
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Bills')).toBeDefined()
    expect(screen.getByText('Step 2 of 8')).toBeDefined()

    // Slide 3: Alias
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Alias')).toBeDefined()
    expect(screen.getByText('Step 3 of 8')).toBeDefined()

    // Slide 4: Panic
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Panic')).toBeDefined()
    expect(screen.getByText('Step 4 of 8')).toBeDefined()

    // Slide 5: Vouch
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Vouch')).toBeDefined()
    expect(screen.getByText('Step 5 of 8')).toBeDefined()

    // Slide 6: Vote
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Vote')).toBeDefined()
    expect(screen.getByText('Step 6 of 8')).toBeDefined()

    // Slide 7: ID
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('ID')).toBeDefined()
    expect(screen.getByText('Step 7 of 8')).toBeDefined()

    // Slide 8: Forum
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Forum')).toBeDefined()
    expect(screen.getByText('Step 8 of 8')).toBeDefined()

    // Click Got It on last slide -> closes modal
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes when close X button is clicked and resets to slide 1 on reopen', () => {
    function TestReopen() {
      const { open, currentIndex, slides, next, close, openModal } = useHowItWorks(false)
      return (
        <div>
          <button type="button" onClick={openModal}>
            Open Modal
          </button>
          <HowItWorksModal
            open={open}
            currentIndex={currentIndex}
            slides={slides}
            onNext={next}
            onClose={close}
          />
        </div>
      )
    }

    render(<TestReopen />)

    // Open modal
    fireEvent.click(screen.getByRole('button', { name: 'Open Modal' }))
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Visitor Code')).toBeDefined()

    // Advance to Bills
    fireEvent.click(screen.getByRole('button', { name: 'Got It' }))
    expect(screen.getByText('Bills')).toBeDefined()

    // Close with X
    const closeBtn = screen.getByRole('button', {
      name: /close how rezzident works modal/i,
    })
    fireEvent.click(closeBtn)
    expect(screen.queryByRole('dialog')).toBeNull()

    // Reopen modal -> starts at slide 1 (Visitor Code)
    fireEvent.click(screen.getByRole('button', { name: 'Open Modal' }))
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Visitor Code')).toBeDefined()
    expect(screen.getByText('Step 1 of 8')).toBeDefined()
  })

  it('closes on Escape key press and resets', () => {
    function TestEscape() {
      const { open, currentIndex, slides, next, close, openModal } = useHowItWorks(true)
      return (
        <div>
          <button type="button" onClick={openModal}>
            Trigger
          </button>
          <HowItWorksModal
            open={open}
            currentIndex={currentIndex}
            slides={slides}
            onNext={next}
            onClose={close}
          />
        </div>
      )
    }

    render(<TestEscape />)
    expect(screen.getByRole('dialog')).toBeDefined()

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()

    // Reopen -> starts at slide 1
    fireEvent.click(screen.getByRole('button', { name: 'Trigger' }))
    expect(screen.getByRole('dialog')).toBeDefined()
    expect(screen.getByText('Visitor Code')).toBeDefined()
  })

  it('returns focus to trigger element on close', () => {
    function TestFocus() {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <button type="button" id="trigger" onClick={() => setOpen(true)}>
            Launch
          </button>
          <HowItWorksModal
            open={open}
            currentIndex={0}
            slides={mockHowItWorksSlides}
            onNext={() => setOpen(false)}
            onClose={() => setOpen(false)}
          />
        </div>
      )
    }

    render(<TestFocus />)
    const trigger = screen.getByRole('button', { name: 'Launch' })
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).toBeDefined()

    const closeBtn = screen.getByRole('button', {
      name: /close how rezzident works modal/i,
    })
    fireEvent.click(closeBtn)

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('does not leave duplicate overlays after open, close, open', () => {
    function TestDuplicates() {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <button type="button" onClick={() => setOpen((prev) => !prev)}>
            Toggle
          </button>
          <HowItWorksModal
            open={open}
            currentIndex={0}
            slides={mockHowItWorksSlides}
            onNext={() => setOpen(false)}
            onClose={() => setOpen(false)}
          />
        </div>
      )
    }

    render(<TestDuplicates />)
    const toggleBtn = screen.getByRole('button', { name: 'Toggle' })

    // Open
    fireEvent.click(toggleBtn)
    expect(screen.getAllByRole('dialog').length).toBe(1)

    // Close
    fireEvent.click(toggleBtn)
    expect(screen.queryAllByRole('dialog').length).toBe(0)

    // Open again
    fireEvent.click(toggleBtn)
    expect(screen.getAllByRole('dialog').length).toBe(1)
  })
})
