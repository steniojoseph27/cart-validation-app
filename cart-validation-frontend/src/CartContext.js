import { createContext, useContext, useState } from "react";
import api from "./api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const validateCart = async (updatedCart) => {
    try {
      const response = await api.post("/cart/validate", {
        customerId: "cust123",
        cartId: "cart001",
        items: updatedCart.map(item => ({
          sku: item.sku,
          quantity: item.quantity
        }))
      });
      return response.data;
    } catch (err) {
      console.error("Validation failed", err);
      return { isValid: false, message: "Server error during validation." };
    }
  };

  const addToCart = async (product) => {
    const existing = cart.find(p => p.sku === product.sku);
    const updatedCart = existing
      ? cart.map(p =>
          p.sku === product.sku ? { ...p, quantity: p.quantity + 1 } : p
        )
      : [...cart, { ...product, quantity: 1 }];

    const validation = await validateCart(updatedCart);

    if (validation.isValid) {
      setCart(updatedCart);
      setValidationErrors(prev => ({ ...prev, [product.sku]: null }));
    } else {
      setValidationErrors(prev => ({ ...prev, [product.sku]: validation.message }));
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, validationErrors }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
