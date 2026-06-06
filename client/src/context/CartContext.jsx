import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { token, user, loading: authLoading } = useAuth();

  const fetchCart = useCallback(async (active = { current: true }) => {
    if (authLoading || !token || !user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get('/api/cart');
      if (active.current && res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error('Error fetching cart', err);
    } finally {
      if (active.current) setLoading(false);
    }
  }, [token, user, authLoading]);

  useEffect(() => {
    const active = { current: true };
    fetchCart(active);
    return () => {
      active.current = false;
    };
  }, [fetchCart]);

  // Add Item to Cart
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!token || !user) {
      return { success: false, redirect: true };
    }
    try {
      const res = await axios.post('/api/cart/add', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error adding to cart'
      };
    }
  }, [token, user]);

  // Update Cart Quantity
  const updateCartQty = useCallback(async (productId, quantity) => {
    try {
      const res = await axios.put('/api/cart/update', { productId, quantity });
      if (res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error updating quantity'
      };
    }
  }, []);

  // Remove Item
  const removeFromCart = useCallback(async (productId) => {
    try {
      const res = await axios.delete('/api/cart/remove', { data: { productId } });
      if (res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error removing item'
      };
    }
  }, []);

  // Clear Cart
  const clearCart = useCallback(async () => {
    try {
      const res = await axios.delete('/api/cart/clear');
      if (res.data.success) {
        setCart(res.data.cart);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error clearing cart'
      };
    }
  }, []);

  const getCartCount = useCallback(() => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }, [cart]);

  const getCartTotal = useCallback(() => {
    return cart?.items?.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0) || 0;
  }, [cart]);

  const contextValue = useMemo(() => ({
    cart,
    loading,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    refreshCart: fetchCart
  }), [
    cart,
    loading,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    fetchCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
