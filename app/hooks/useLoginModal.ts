import { create } from 'zustand'
import { ModalType } from '@/app/types'

const useLoginModal = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))

export default useLoginModal
// ===========================================================
// Zustand で作られた グローバルな状態管理。
// アプリのどこからでもログインモーダルの開閉が可能。
// loginModal.onOpen() のように使うと、ログインモーダルが開く。
// ===========================================================

// ===========================================================
// const [isOpen, setIsOpen] = useState(false)のように
// アプリ内全体にpropsを渡して管理してもログインモーダルは作れるが
// コンポーネントの階層が深くなる
// 複数の状態が必要になる
// 同じ状態を複数箇所で使う
// などのデメリットがある
// ===========================================================
