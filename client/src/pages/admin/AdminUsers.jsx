import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Trash2, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async (active = { current: true }) => {
    try {
      setLoading(true);
      const url = search ? `/api/users?search=${encodeURIComponent(search)}` : '/api/users';
      const res = await axios.get(url);
      if (active.current && res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load customer profiles');
    } finally {
      if (active.current) setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const active = { current: true };
    fetchUsers(active);
    return () => {
      active.current = false;
    };
  }, [fetchUsers]);

  const handleToggleBlock = async (userObj) => {
    try {
      const res = await axios.put(`/api/users/block/${userObj._id}`);
      if (res.data.success) {
        toast.success(res.data.message || 'User status toggled successfully');
        // Refresh users list
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle block status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account? This action is irreversible.')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/users/${userId}`);
      if (res.data.success) {
        toast.success(res.data.message || 'User account deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user account');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
      <AdminSidebar />

      <div className="flex-grow p-6 lg:p-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200/50 dark:border-slate-800/80 pb-5 gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight flex items-center space-x-2">
              <Users className="w-8 h-8 text-secondary" />
              <span>User Accounts Management</span>
            </h1>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              Search profiles, manage logins access (block / unblock), or remove buyer profiles.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full shrink-0">
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-secondary"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="skeleton-shimmer h-16 w-full rounded-2xl"></div>)}
          </div>
        ) : users.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-4 px-6">Customer Details</th>
                    <th className="py-4 px-6">Mobile Number</th>
                    <th className="py-4 px-6">Shipping Address</th>
                    <th className="py-4 px-6 text-center">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {users.map((cust) => (
                    <tr key={cust._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      
                      {/* Name / Email */}
                      <td className="py-4 px-6 max-w-[200px]">
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-150 leading-snug truncate">
                            {cust.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 truncate block">{cust.email}</span>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-4 px-6 font-medium text-slate-655 dark:text-slate-350">
                        {cust.mobile || 'N/A'}
                      </td>

                      {/* Address */}
                      <td className="py-4 px-6 max-w-[250px]">
                        <p className="truncate text-slate-450 font-medium" title={cust.address}>
                          {cust.address || 'Address not provided'}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          cust.isBlocked
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}>
                          {cust.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center space-x-2">
                          
                          {/* Toggle Block */}
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(cust)}
                            className={`p-2 rounded-lg border active-press transition-colors ${
                              cust.isBlocked
                                ? 'bg-emerald-500/10 hover:bg-emerald-500 border-emerald-500/20 hover:text-white text-emerald-600'
                                : 'bg-amber-505/10 hover:bg-amber-500 border-amber-500/15 hover:text-white text-amber-500'
                            }`}
                            title={cust.isBlocked ? 'Unblock User' : 'Block User'}
                          >
                            {cust.isBlocked ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(cust._id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/15 active-press transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty users state */
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-105 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">No Users Registered</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-xs mx-auto">
              We couldn't register any active customer accounts matching your search queries.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminUsers;
