import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ExternalLink, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-xl text-center space-y-8"
      >
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight">
            Checkout Redirections Complete!
          </h1>
          <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
            We've logged this order in your CERIA dashboard and launched individual affiliate checkout tabs in your browser!
          </p>
        </div>

        {order && (
          /* Order mini overview */
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 text-left space-y-4 max-w-xl mx-auto">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-200/50 dark:border-slate-700 pb-2">
              Redirect Summary (Order #{order._id.slice(-8).toUpperCase()})
            </h3>
            
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={item.product || `${item.name}-${idx}`} className="flex justify-between items-center text-xs font-semibold">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase text-secondary tracking-widest px-1.5 py-0.5 rounded bg-secondary/15 mr-2">
                      {item.sourcePlatform}
                    </span>
                    <span className="text-slate-705 dark:text-slate-300 line-clamp-1 max-w-[200px] inline-block align-middle">{item.name}</span>
                  </div>
                  <a
                    href={item.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary hover:underline flex items-center space-x-1 font-bold shrink-0"
                  >
                    <span>Tab {idx + 1} link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-700 pt-3 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-500">Transaction Volume</span>
              <span className="text-slate-900 dark:text-white">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Informative pitch */}
        <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/15 text-xs text-amber-600 dark:text-amber-400 font-semibold leading-relaxed max-w-xl mx-auto flex items-start space-x-2 text-left">
          <HelpCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <span>
            <strong>What happens next?</strong> Please verify if your browser blocked popups for these tabs. If any platform tab failed to open automatically, click the redirect links above to complete your purchases.
          </span>
        </div>

        {/* Buttons navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-xl mx-auto">
          <Link
            to="/orders"
            className="flex-grow py-3 px-6 rounded-xl bg-secondary hover:bg-secondary-hover text-white font-extrabold active-press text-sm tracking-wider uppercase shadow-md shadow-secondary/10 flex items-center justify-center space-x-2"
          >
            <span>View Redirection Logs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/products"
            className="flex-grow py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold active-press text-sm tracking-wider uppercase border border-slate-200 dark:border-slate-700/80"
          >
            Shop More Deals
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Checkout;
