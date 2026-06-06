import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, PlusCircle,
  TrendingUp, Users, ArrowLeft, Image
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard Stats',
    path: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Product List',
    path: '/admin/products',
    icon: ShoppingBag
  },
  {
    name: 'Add Product',
    path: '/admin/add-product',
    icon: PlusCircle
  },
  {
    name: 'Manage Banners',
    path: '/admin/banners',
    icon: Image
  },
  {
    name: 'Order Logs',
    path: '/admin/orders',
    icon: TrendingUp
  },
  {
    name: 'User Management',
    path: '/admin/users',
    icon: Users
  }
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/80 p-5 flex flex-col space-y-6">
      
      {/* Return to website */}
      <Link
        to="/"
        className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-secondary uppercase tracking-widest transition-colors mb-2"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Main Platform</span>
      </Link>

      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">
          Admin Suite
        </h2>
        <span className="text-[10px] uppercase font-bold text-slate-400">
          CERIA Control Panel
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex flex-col space-y-1.5 flex-grow font-semibold text-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info inside Admin Panel */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
        Version 1.0.0
      </div>

    </div>
  );
};

export default AdminSidebar;
