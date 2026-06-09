import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, KeyRound, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Email Request, Step 2: OTP Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(''); // Dev fallback helper
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  const { forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    try {
      setResending(true);
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success(res.message || 'Verification code has been resent to your email.');
        setCooldown(60); // 60s cooldown (1 min)
        if (res.otpCode) {
          setDevOtp(res.otpCode);
        }
      } else {
        toast.error(res.message || 'Failed to resend code');
      }
    } catch (err) {
      toast.error('An error occurred while resending the code');
    } finally {
      setResending(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success(res.message);
        if (res.otpCode) {
          setDevOtp(res.otpCode); // Store for UI developer-helper
        }
        setStep(2);
      } else {
        toast.error(res.message || 'Failed to request password reset');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password) {
      toast.warning('Please fill in the OTP code and new password');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/_\-\.]).{6,}$/;
    if (!passwordRegex.test(password)) {
      toast.warning('Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword(email, otp, password);
      if (res.success) {
        toast.success('Your password has been reset successfully!');
        navigate('/login');
      } else {
        toast.error(res.message || 'OTP reset failed');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
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
            Reset Password
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-1.5">
            {step === 1
              ? 'Enter your email to request a 6-digit verification code'
              : 'Enter the 6-digit OTP and your new secure password'}
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
          /* Step 1: Request Form */
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Your Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-secondary-hover text-white py-3.5 rounded-xl font-bold active-press transition-colors flex items-center justify-center space-x-2 text-sm shadow-lg shadow-secondary/15 disabled:bg-secondary/75"
            >
              <span>{loading ? 'Requesting OTP...' : 'Send Verification OTP'}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </form>
        ) : (
          /* Step 2: Reset Form */
          <form onSubmit={handleResetPassword} className="space-y-4">
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary transition-colors"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold active-press transition-colors flex items-center justify-center space-x-2 text-sm shadow-lg shadow-emerald-500/15 disabled:bg-emerald-600/75"
            >
              <span>{loading ? 'Updating Password...' : 'Reset & Save Password'}</span>
              <ShieldCheck className="w-4.5 h-4.5" />
            </button>

            {/* Resend verification button */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Didn't receive the code?
              </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || resending}
                className="text-xs font-bold text-secondary hover:underline disabled:text-slate-400 disabled:no-underline transition-all active-press"
              >
                {cooldown > 0 ? `Resend Code in ${cooldown}s` : resending ? 'Resending...' : 'Resend Verification Code'}
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 text-center text-sm font-semibold text-slate-500">
          <Link to="/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
