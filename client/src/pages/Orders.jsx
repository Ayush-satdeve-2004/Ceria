import React, { useState, useEffect } from 'react';
import { History, ExternalLink, Calendar, Layers, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

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

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get('/api/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="skeleton-shimmer h-12 w-1/3 rounded-xl mx-auto mb-6"></div>
        <div className="space-y-4">
          {[1, 2].map(n => <div key={n} className="skeleton-shimmer h-32 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <History className="w-8 h-8 text-secondary" />
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
            Order Redirections History
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Track your checkout redirection logs to Amazon, Flipkart, Meesho and others.
          </p>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Header meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-3">
                <div className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>•</span>
                  <span>ID: #{order._id.slice(-8).toUpperCase()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items row */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {order.items.map((item, idx) => (
                  <div key={item.product || `${item.name}-${idx}`} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 first:pt-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-black uppercase text-secondary tracking-widest px-1.5 py-0.5 rounded bg-secondary/10">
                          {item.sourcePlatform}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">QTY: {item.quantity}</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 leading-snug">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-4 ml-auto sm:ml-0">
                      <span className="font-black text-slate-900 dark:text-white text-sm">
                        ${(item.price * item.quantity).toLocaleString('en-US')}
                      </span>
                      <a
                        href={item.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-secondary active-press border border-slate-100 dark:border-slate-700/60"
                        title="Resume Checkout"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Total */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500">Transaction Volume</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  ${order.totalAmount.toLocaleString('en-US')}
                </span>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Empty Orders */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm max-w-xl mx-auto">
          <History className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">No Order Redirections</h2>
          <p className="text-sm font-semibold text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
            You haven't redirected to any affiliate shops yet. Items ordered via cart checkouts will show up here.
          </p>
        </div>
      )}

    </div>
  );
};

export default Orders;
