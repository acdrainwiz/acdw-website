import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: string
  maxQuantity?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  promoCode: string | null
  applyPromoCode: (code: string) => Promise<boolean>
  removePromoCode: () => void
  promoDiscount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCode] = useState<string | null>(null)
  const [promoDiscount, setPromoDiscount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('acdw_cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('acdw_cart', JSON.stringify(items))
  }, [items])

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(currentItems => {
      // Check if this product already exists in cart (by productId, not unique id)
      const existingItem = currentItems.find(i => i.productId === item.productId)
      
      if (existingItem) {
        // Merge into existing item - increase quantity
        return currentItems.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        )
      }
      
      // Add new item with unique id
      return [...currentItems, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setPromoCode(null)
    setPromoDiscount(0)
  }

  const getCartTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return subtotal - promoDiscount
  }

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const applyPromoCode = async (code: string): Promise<boolean> => {
    // TODO: Replace with actual API call to validate promo code
    // For now, simulate validation
    const validCodes: Record<string, number> = {
      'SAVE10': 10,
      'WELCOME15': 15,
      'ACDW20': 20
    }

    if (validCodes[code.toUpperCase()]) {
      setPromoCode(code.toUpperCase())
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setPromoDiscount((subtotal * validCodes[code.toUpperCase()]) / 100)
      return true
    }

    return false
  }

  const removePromoCode = () => {
    setPromoCode(null)
    setPromoDiscount(0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        promoDiscount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

