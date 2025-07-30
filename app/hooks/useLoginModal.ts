import { create } from 'zustand'
import { ModalType } from '@/app/types'

const useLoginModal = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useLoginModal