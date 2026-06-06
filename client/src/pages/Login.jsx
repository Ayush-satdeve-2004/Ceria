import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Login Form, 2: OTP Verification
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState(''); // Dev helper for intercepting OTP
  const [submitting, setSubmitting] = useState(false);

  const { loginUser, verifyEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin/dashboard' : '/');
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning('Please enter email and password');
      return;
    }

    try {
      setSubmitting(true);
      const res = await loginUser(email, password);
      if (res.success) {
        toast.success('Successfully logged in! Welcome back.');
      } else if (res.requiresVerification) {
        toast.warning(res.message || 'Please verify your email address.');
        if (res.otpCode) {
          setDevOtp(res.otpCode);
        }
        setStep(2);
      } else {
        toast.error(res.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      toast.error('An error occurred during login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.warning('Please enter the 6-digit verification code');
      return;
    }

    try {
      setSubmitting(true);
      const res = await verifyEmail(email, otp);
      if (res.success) {
        toast.success('Account activated successfully! Logged in.');
      } else {
        toast.error(res.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      toast.error('An error occurred during email verification');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-bgDark transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {step === 1 ? 'Welcome Back' : 'Verify Email'}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1.5">
            {step === 1
              ? 'Log in to manage your affiliate shopping dashboard'
              : `Enter the 6-digit verification code sent to ${email}`}
          </p>
        </div>

        {/* Development Mode Helper Banner */}
        {devOtp && step === 2 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold leading-relaxed">
            <span className="font-bold">⚠️ DEVELOPMENT OTP ASSISTANT:</span><br/>
            Nodemailer is not configured in `.env`. We intercepted the OTP dispatch! Use code:
            <span className="font-extrabold text-base tracking-widest block text-center my-2 select-all bg-white dark:bg-slate-800 py-1.5 rounded-lg border border-amber-500/25">
              {devOtp}
            </span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  name="email"
                  autoComplete="off"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-bold text-secondary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  name="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-secondary hover:bg-secondary-hover text-white py-3.5 rounded-xl font-bold active-press transition-colors flex items-center justify-center space-x-2 text-sm shadow-lg shadow-secondary/15 disabled:bg-secondary/75"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Verification OTP (6 Digits)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary transition-colors text-center tracking-widest font-bold"
                />
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold active-press transition-colors flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-500/15 disabled:bg-emerald-600/75"
            >
              <span>{submitting ? 'Verifying...' : 'Verify & Activate Account'}</span>
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>
          </form>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 text-center text-sm font-semibold text-slate-500 dark:text-slate-450">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-secondary hover:underline flex items-center justify-center space-x-1 mt-2">
            <span>Create one now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
