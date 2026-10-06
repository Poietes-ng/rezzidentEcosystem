// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { Modal } from '#/shared/components/ui/modal'

describe('Modal Primitive', () => {
  it('renders portal in document.body when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()} titleId="test-modal-title">
        <h2 id="test-modal-title">Test Modal</h2>
        <button type="button">Action</button>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeDefined()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-labelledby')).toBe('test-modal-title')
    expect(screen.getByText('Test Modal')).toBeDefined()
  })

  it('does not render when open is false', () => {
    render(
      <Modal open={false} onClose={vi.fn()} titleId="test-modal-title">
        <h2 id="test-modal-title">Test Modal</h2>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes on Escape key press', () => {
    const handleClose = vi.fn()
    render(
      <Modal open={true} onClose={handleClose}>
        <button type="button">Close</button>
      </Modal>,
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('handles closeOnOverlayClick correctly', () => {
    const handleClose = vi.fn()
    const { rerender } = render(
      <Modal open={true} onClose={handleClose} closeOnOverlayClick={false}>
        <div>Content</div>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    fireEvent.click(dialog)
    expect(handleClose).not.toHaveBeenCalled()

    rerender(
      <Modal open={true} onClose={handleClose} closeOnOverlayClick={true}>
        <div>Content</div>
      </Modal>,
    )
    fireEvent.click(dialog)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll on open and restores on close', () => {
    function TestWrapper() {
      const [open, setOpen] = useState(true)
      return (
        <div>
          <button type="button" onClick={() => setOpen(false)}>
            Toggle
          </button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div>Content</div>
          </Modal>
        </div>
      )
    }

    render(<TestWrapper />)
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByText('Toggle'))
    expect(document.body.style.overflow).toBe('')
  })

  it('returns focus to trigger element when closed', () => {
    function TestWrapper() {
      const [open, setOpen] = useState(false)
      return (
        <div>
          <button type="button" id="trigger-btn" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)}>
            <button type="button" id="inside-btn" onClick={() => setOpen(false)}>
              Inside
            </button>
          </Modal>
        </div>
      )
    }

    render(<TestWrapper />)
    const triggerBtn = screen.getByRole('button', { name: 'Open' })
    triggerBtn.focus()
    expect(document.activeElement).toBe(triggerBtn)

    fireEvent.click(triggerBtn)
    expect(screen.getByRole('dialog')).toBeDefined()

    const insideBtn = screen.getByRole('button', { name: 'Inside' })
    fireEvent.click(insideBtn)

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(triggerBtn)
  })
})
