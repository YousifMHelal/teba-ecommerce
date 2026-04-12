import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

type CartState = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  subtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((existing) => existing.id === item.id)
            ? state.items.map((existing) =>
                existing.id === item.id
                  ? { ...existing, quantity: existing.quantity + item.quantity }
                  : existing,
              )
            : [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        })),
      clearCart: () => set({ items: [] }),
      subtotal: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "teba-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
