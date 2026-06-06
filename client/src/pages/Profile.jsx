import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Save, ShieldAlert, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setMobile(user.mobile || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      toast.warning('Name and Mobile number are required');
      return;
    }

    try {
      setSaving(true);
      const res = await updateProfile(name, mobile, address);
      if (res.success) {
        toast.success(res.message || 'Profile details updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update details');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="skeleton-shimmer h-8 w-1/3 rounded mx-auto mb-4"></div>
        <div className="skeleton-shimmer h-32 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          My Account
        </h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Manage your personal profiles, dispatch addresses, and affiliate transaction orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Summary statistics (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm text-center space-y-4">
            
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto text-secondary text-2xl font-black uppercase">
              {user?.name?.[0]}
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white truncate">{user?.name}</h3>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => navigate('/orders')}
                className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold active-press border border-slate-250/20 flex items-center justify-center space-x-2"
              >
                <History className="w-4 h-4" />
                <span>View Orders History</span>
              </button>
            </div>

          </div>

          <div className="p-4 bg-blue-500/5 rounded-3xl border border-blue-500/15 text-[11px] leading-relaxed font-semibold text-blue-600 dark:text-blue-450 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>
              Your logins and data transactions are fully locked and protected using industry-standard JWT signatures.
            </span>
          </div>
        </div>

        {/* Right Card: Update details form (8 Cols) */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800/80 shadow-sm">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-white border-b border-slate-105 dark:border-slate-800 pb-3 mb-6">
              Update Contact Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-455 uppercase tracking-wider block">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-455 uppercase tracking-wider block">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-1.5 opacity-60">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wider block">Email Address (Cannot Change)</label>
                <input
                  type="email"
                  disabled
                  readOnly
                  value={user?.email || ''}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl py-3 px-4 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-455 uppercase tracking-wider block">Shipping Address</label>
                <div className="relative">
                  <textarea
                    placeholder="Enter your street address, apartment, city, state, country..."
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
                  ></textarea>
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="bg-secondary hover:bg-secondary-hover text-white py-3 px-6 rounded-xl font-bold active-press text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-secondary/15 disabled:bg-secondary/75"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Details'}</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
