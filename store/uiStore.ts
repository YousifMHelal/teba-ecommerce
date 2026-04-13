import { create } from "zustand"

type UIState = {
  cartOpen: boolean
  searchOpen: boolean
  setCartOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  searchOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))
