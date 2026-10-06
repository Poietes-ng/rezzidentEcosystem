// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StepProgress } from '#/shared/components/ui/step-progress'

describe('StepProgress', () => {
  it('renders default bar variant with label', () => {
    render(<StepProgress currentStep={2} totalSteps={5} />)

    expect(screen.getByText('Step 2 of 5')).toBeDefined()
  })

  it('renders segmented variant with correct total segments, widths, and active states', () => {
    const { container } = render(
      <StepProgress currentStep={3} totalSteps={8} variant="segmented" />,
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar.getAttribute('aria-valuenow')).toBe('3')
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1')
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8')
    expect(screen.getByText('Step 3 of 8')).toBeDefined()

    // 8 segments rendered
    const segments = container.querySelectorAll('.rounded-full')
    expect(segments.length).toBe(8)

    // 3rd segment (active): wider w-[26px] and bg-actionDark
    expect(segments[2].className).toContain('w-[26px]')
    expect(segments[2].className).toContain('bg-actionDark')

    // Inactive segments: narrower w-[15px] and bg-stoneEdge
    expect(segments[0].className).toContain('w-[15px]')
    expect(segments[0].className).toContain('bg-stoneEdge')
    expect(segments[1].className).toContain('w-[15px]')
    expect(segments[1].className).toContain('bg-stoneEdge')
    expect(segments[3].className).toContain('w-[15px]')
    expect(segments[3].className).toContain('bg-stoneEdge')
  })
})
