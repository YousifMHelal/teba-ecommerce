import { create } from "zustand"

type UIStore = {
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  cartOpen: boolean
  searchOpen: boolean
  setCartOpen: (open: boolean) => void
  setMobileMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  cartOpen: false,
  searchOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open, cartOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
}))
