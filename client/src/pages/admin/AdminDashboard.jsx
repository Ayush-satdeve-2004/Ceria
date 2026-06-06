import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, ShoppingBag, ShoppingCart, DollarSign, Eye, Award
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get('/api/orders/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
        <AdminSidebar />
        <div className="flex-grow p-8 space-y-6">
          <div className="skeleton-shimmer h-12 w-1/4 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <div key={n} className="skeleton-shimmer h-32 rounded-3xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Products Stock',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    {
      title: 'Customer Bases',
      value: stats?.totalUsers || 0,
      icon: Users,
      bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    {
      title: 'Active Cart Items',
      value: stats?.totalCartItems || 0,
      icon: ShoppingCart,
      bg: 'bg-violet-500/10 text-violet-500 border-violet-500/20'
    },
    {
      title: 'Order Redirections',
      value: stats?.totalOrders || 0,
      icon: TrendingUp,
      bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
      {/* Drawer */}
      <AdminSidebar />

      {/* Main Stats Pane */}
      <div className="flex-grow p-6 lg:p-10 space-y-10">
        
        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/50 dark:border-slate-800/80 pb-5 gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight">
              Dashboard Analytics
            </h1>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              Real-time calculations of CERIA marketplace traffic, carts, and commissions.
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => fetchStats(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-200 text-xs font-extrabold active-press"
            >
              Refresh Stats
            </button>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex items-center justify-between"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{card.title}</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${card.bg}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenue Highlight banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-2 relative z-10">
            <span className="inline-block px-3 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-widest">
              Revenue Analytics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              Commission Estimations
            </h2>
            <p className="text-xs font-semibold text-slate-450 leading-relaxed max-w-lg">
              Calculated based on an average **8% affiliate referral fee** applied to redirected order checkouts. Final conversions occur on merchant stores.
            </p>
          </div>

          <div className="text-center shrink-0 p-5 bg-white/5 border border-white/10 rounded-2xl relative z-10 md:min-w-[200px]">
            <span className="text-xs text-slate-400 block font-bold uppercase mb-1">Estimated Earnings</span>
            <span className="text-3xl font-extrabold text-amber-400">
              ₹{stats?.revenueEstimation?.toLocaleString('en-IN') || 0}
            </span>
            <span className="text-[10px] text-slate-450 font-semibold block mt-1 uppercase">
              From ₹{stats?.totalTransactionVolume?.toLocaleString('en-IN') || 0} redirection volume
            </span>
          </div>
        </div>

        {/* Charts & Table analytics row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Most Viewed products (5 items) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Award className="w-5 h-5 text-secondary" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-white">Most Visited Products</h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {stats?.mostViewedProducts?.map((item, idx) => (
                <div key={item._id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
                  <div className="flex items-center space-x-3 truncate">
                    <span className="w-6 h-6 bg-slate-50 dark:bg-slate-850 text-xs font-extrabold text-slate-500 rounded-full flex items-center justify-center shrink-0 border">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-150 truncate leading-snug">{item.name}</h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{item.brand} • {item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0 text-slate-500 text-xs font-bold">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.viewsCount} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Transaction analytics table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-white">Monthly Transaction Summary</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400">
                    <th className="py-2.5">Month</th>
                    <th className="py-2.5">Checkout Volume</th>
                    <th className="py-2.5 text-emerald-500">Comm. (8%)</th>
                    <th className="py-2.5">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-350">
                  {stats?.monthlyStats && stats.monthlyStats.length > 0 ? (
                    stats.monthlyStats.map((item) => (
                      <tr key={item.month}>
                        <td className="py-3 font-extrabold">{item.month}</td>
                        <td className="py-3">₹{item.sales.toLocaleString('en-IN')}</td>
                        <td className="py-3 text-emerald-500 font-extrabold">₹{item.commissions.toLocaleString('en-IN')}</td>
                        <td className="py-3 font-bold">{item.orders} times</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 font-normal">No transactional analytics available for active months.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
