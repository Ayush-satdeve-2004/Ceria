import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const { token, user, loading: authLoading } = useAuth();

  const fetchWishlist = useCallback(async (active = { current: true }) => {
    if (authLoading || !token || !user) {
      setWishlist({ products: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get('/api/wishlist');
      if (active.current && res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error('Error fetching wishlist', err);
    } finally {
      if (active.current) setLoading(false);
    }
  }, [token, user, authLoading]);

  useEffect(() => {
    const active = { current: true };
    fetchWishlist(active);
    return () => {
      active.current = false;
    };
  }, [fetchWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    if (!token || !user) {
      return { success: false, redirect: true };
    }
    try {
      const res = await axios.post('/api/wishlist/add', { productId });
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error adding to wishlist'
      };
    }
  }, [token, user]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!token || !user) {
      return { success: false, redirect: true };
    }
    try {
      const res = await axios.delete(`/api/wishlist/remove/${productId}`);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error removing from wishlist'
      };
    }
  }, [token, user]);

  const isInWishlist = useCallback((productId) => {
    return wishlist?.products?.some(p => p._id === productId || p === productId) || false;
  }, [wishlist]);

  const getWishlistCount = useCallback(() => {
    return wishlist?.products?.length || 0;
  }, [wishlist]);

  const contextValue = useMemo(() => ({
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    refreshWishlist: fetchWishlist
  }), [
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    fetchWishlist
  ]);

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
