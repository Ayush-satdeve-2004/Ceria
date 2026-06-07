import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Forgot Password (pure function hoisted to module scope to avoid re-creation on render)
export const forgotPassword = async (email) => {
  try {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return {
      success: true,
      message: res.data.message,
      otpCode: res.data.otpCode // Handled for local dev testing convenient support
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Failed to request reset'
    };
  }
};

// Reset Password (pure function hoisted to module scope to avoid re-creation on render)
export const resetPassword = async (email, otp, password) => {
  try {
    const res = await axios.post('/api/auth/reset-password', { email, otp, password });
    return {
      success: true,
      message: res.data.message
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'OTP reset failed'
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  // Configure global axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = false;
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';
  }, []);

  const loadUser = useCallback(async (active = { current: true }) => {
    try {
      setLoading(true);
      const storedToken = sessionStorage.getItem('ceria_token:v1') || '';
      if (!storedToken) {
        if (active.current) {
          setUser(null);
          setToken('');
          setLoading(false);
        }
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
      const res = await axios.get('/api/auth/me');
      if (res.data.success && active.current) {
        setUser(res.data.user);
        setToken(storedToken);
        sessionStorage.setItem('ceria_user:v1', JSON.stringify(res.data.user));
      } else if (!res.data.success) {
        throw new Error('Invalid auth response');
      }
    } catch (err) {
      console.error('Session expired or invalid token', err);
      if (active.current) {
        sessionStorage.removeItem('ceria_token:v1');
        sessionStorage.removeItem('ceria_user:v1');
        delete axios.defaults.headers.common.Authorization;
        setUser(null);
        setToken('');
      }
    } finally {
      if (active.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const active = { current: true };
    loadUser(active);
    return () => {
      active.current = false;
    };
  }, [loadUser]);

  // Register User
  const registerUser = useCallback(async (name, email, password, mobile) => {
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, mobile });
      if (res.data.success) {
        if (res.data.requiresVerification) {
          return {
            success: true,
            requiresVerification: true,
            email: res.data.email,
            message: res.data.message,
            otpCode: res.data.otpCode
          };
        }
        const authToken = res.data.token || '';
        sessionStorage.setItem('ceria_token:v1', authToken);
        sessionStorage.setItem('ceria_user:v1', JSON.stringify(res.data.user));
        axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        setUser(res.data.user);
        setToken(authToken);
        return { success: true };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    }
  }, []);

  // Login User
  const loginUser = useCallback(async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const authToken = res.data.token || '';
        sessionStorage.setItem('ceria_token:v1', authToken);
        sessionStorage.setItem('ceria_user:v1', JSON.stringify(res.data.user));
        axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        setUser(res.data.user);
        setToken(authToken);
        return { success: true };
      }
    } catch (err) {
      if (err.response?.data?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: err.response.data.email,
          message: err.response.data.message,
          otpCode: err.response.data.otpCode
        };
      }
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid credentials'
      };
    }
  }, []);

  // Verify Email
  const verifyEmail = useCallback(async (email, otp) => {
    try {
      const res = await axios.post('/api/auth/verify-email', { email, otp });
      if (res.data.success) {
        const authToken = res.data.token || '';
        sessionStorage.setItem('ceria_token:v1', authToken);
        sessionStorage.setItem('ceria_user:v1', JSON.stringify(res.data.user));
        axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
        setUser(res.data.user);
        setToken(authToken);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Verification failed'
      };
    }
  }, []);

  // Update Profile
  const updateProfile = useCallback(async (name, mobile, address) => {
    try {
      const res = await axios.put('/api/auth/profile', { name, mobile, address });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Profile update failed'
      };
    }
  }, []);

  // Logout User
  const logoutUser = useCallback(async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      sessionStorage.removeItem('ceria_token:v1');
      sessionStorage.removeItem('ceria_user:v1');
      delete axios.defaults.headers.common.Authorization;
      setToken('');
      setUser(null);
    }
  }, []);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  const contextValue = useMemo(() => ({
    user,
    token,
    loading,
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile,
    logoutUser,
    isAdmin
  }), [
    user,
    token,
    loading,
    registerUser,
    loginUser,
    verifyEmail,
    updateProfile,
    logoutUser,
    isAdmin
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
