import { createSlice } from '@reduxjs/toolkit';
const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
    isCartOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isCartOpen = true; // Auto-open cart when item is added
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    clearCart: (state) => {
      state.items = [];
      state.isCartOpen = false;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
  },
});
export const { addToCart, removeFromCart, updateQuantity, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;