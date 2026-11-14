import { useState } from 'react'

export type HomeModalType = 'how-it-works' | 'panic' | 'update' | 'feedback' | null

export interface UseHomeModalsReturn {
  activeModal: HomeModalType
  openModal: (modal: Exclude<HomeModalType, null>) => void
  closeModal: () => void
  isModalOpen: (modal: Exclude<HomeModalType, null>) => boolean
}

export function useHomeModals(initialModal: HomeModalType = null): UseHomeModalsReturn {
  const [activeModal, setActiveModal] = useState<HomeModalType>(initialModal)

  function openModal(modal: Exclude<HomeModalType, null>): void {
    setActiveModal(modal)
  }

  function closeModal(): void {
    setActiveModal(null)
  }

  function isModalOpen(modal: Exclude<HomeModalType, null>): boolean {
    return activeModal === modal
  }

  return {
    activeModal,
    openModal,
    closeModal,
    isModalOpen,
  }
}
