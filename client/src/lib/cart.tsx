import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  restaurantId: number | null;
  restaurantName: string | null;
  addItem: (item: CartItem, restaurantId: number, restaurantName: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQty: (menuItemId: number, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("kugoo_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [restaurantId, setRestaurantId] = useState<number | null>(() => {
    const v = localStorage.getItem("kugoo_cart_rid");
    return v ? Number(v) : null;
  });
  const [restaurantName, setRestaurantName] = useState<string | null>(
    () => localStorage.getItem("kugoo_cart_rname"),
  );

  useEffect(() => {
    localStorage.setItem("kugoo_cart", JSON.stringify(items));
    if (restaurantId) localStorage.setItem("kugoo_cart_rid", String(restaurantId));
    else localStorage.removeItem("kugoo_cart_rid");
    if (restaurantName) localStorage.setItem("kugoo_cart_rname", restaurantName);
    else localStorage.removeItem("kugoo_cart_rname");
  }, [items, restaurantId, restaurantName]);

  const addItem = (item: CartItem, rid: number, rname: string) => {
    setItems((prev) => {
      // Switching restaurants resets cart
      if (restaurantId && restaurantId !== rid) {
        setRestaurantId(rid);
        setRestaurantName(rname);
        return [{ ...item, quantity: item.quantity }];
      }
      setRestaurantId(rid);
      setRestaurantName(rname);
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (menuItemId: number) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.menuItemId !== menuItemId);
      if (next.length === 0) {
        setRestaurantId(null);
        setRestaurantName(null);
      }
      return next;
    });
  };

  const updateQty = (menuItemId: number, qty: number) => {
    if (qty <= 0) return removeItem(menuItemId);
    setItems((prev) => prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: qty } : i)));
  };

  const clear = () => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName(null);
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, restaurantName, addItem, removeItem, updateQty, clear, subtotal, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
