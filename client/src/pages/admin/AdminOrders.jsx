import React, { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, ExternalLink, RefreshCw, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
    case 'Redirected':
      return 'bg-blue-500/10 text-blue-600 border border-blue-500/20';
    default:
      return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get('/api/orders'); // Back-end defaults to returning all populated orders if requested by Admin
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transaction records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
      <AdminSidebar />

      <div className="flex-grow p-6 lg:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/50 dark:border-slate-800/80 pb-5 gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight flex items-center space-x-2">
              <ShoppingBag className="w-8 h-8 text-secondary" />
              <span>Checkout Redirections Logs</span>
            </h1>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              Inspect user checkout sessions, transactional values, and merchant clicks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchOrders(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-655 dark:text-slate-200 text-xs font-extrabold active-press"
          >
            Refresh Logs
          </button>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="skeleton-shimmer h-16 w-full rounded-2xl"></div>)}
          </div>
        ) : orders.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="border-b border-slate-105 dark:border-slate-850 text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Product details</th>
                    <th className="py-4 px-6">Value</th>
                    <th className="py-4 px-6">Redirection Date</th>
                    <th className="py-4 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      
                      {/* ID */}
                      <td className="py-4 px-6 font-bold text-slate-400 uppercase">
                        #{ord._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Customer name */}
                      <td className="py-4 px-6 max-w-[150px]">
                        <div className="flex items-center space-x-2 truncate">
                          <User className="w-4 h-4 text-slate-400 shrink-0" />
                          <div className="truncate">
                            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-150 truncate leading-snug">{ord.user?.name || 'Guest'}</h4>
                            <span className="text-[10px] text-slate-400 truncate block">{ord.user?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Products items summary list */}
                      <td className="py-4 px-6 max-w-[280px]">
                        <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                          {ord.items.map((item, idx) => (
                            <div key={item.product || `${item.name}-${idx}`} className="flex items-center space-x-2 text-[11px] leading-tight">
                              <span className="text-[9px] font-black uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border shrink-0">
                                {item.sourcePlatform}
                              </span>
                              <span className="text-slate-850 dark:text-slate-200 truncate inline-block align-middle max-w-[150px]">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold shrink-0">x{item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 font-medium text-slate-455">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty orders */
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-105 dark:border-slate-800">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">No Redirects Recorded</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-xs mx-auto">
              Checkout redirects list is empty. Redirections logged by shopping cart checkouts will show up here.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminOrders;
