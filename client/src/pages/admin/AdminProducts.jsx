import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit3, Plus, ShoppingBag, ExternalLink, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get('/api/products?limit=100'); // Load all products for admin list
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(false);
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product and its reviews?')) {
      return;
    }

    try {
      const res = await axios.delete(`/api/products/${productId}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Product deleted successfully');
        // Refresh products list
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
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
              <ShoppingBag className="w-8 h-8 text-secondary" />
              <span>Products Inventory</span>
            </h1>
            <p className="text-xs font-semibold text-slate-455 mt-1">
              Add, update details, adjust affiliate links, or remove catalog products.
            </p>
          </div>

          <Link
            to="/admin/add-product"
            className="inline-flex items-center space-x-2 bg-secondary hover:bg-secondary-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold active-press shadow-md shadow-secondary/15 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Table list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => <div key={n} className="skeleton-shimmer h-16 w-full rounded-2xl"></div>)}
          </div>
        ) : products.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Affiliate link</th>
                    <th className="py-4 px-6">views</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      
                      {/* Image / Name info */}
                      <td className="py-4 px-6 flex items-center space-x-3.5 max-w-[280px]">
                        <img src={optimizeImageUrl(prod.images?.[0], 100)} className="w-12 h-9 rounded-lg object-cover bg-slate-50 shrink-0 border" alt="" />
                        <div className="truncate">
                          <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-150 leading-snug truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{prod.brand}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 uppercase tracking-wider text-[10px] font-extrabold text-slate-400">
                        {prod.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </td>

                      {/* Affiliate portal link */}
                      <td className="py-4 px-6 max-w-[180px]">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-black uppercase text-secondary bg-secondary/10 px-1.5 py-0.5 rounded border border-secondary/15 shrink-0">
                            {prod.sourcePlatform}
                          </span>
                          <a
                            href={prod.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-655 dark:hover:text-white truncate text-xs font-semibold hover:underline flex items-center space-x-1"
                          >
                            <span className="truncate max-w-[100px]">{prod.affiliateLink}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      </td>

                      {/* Views count */}
                      <td className="py-4 px-6 text-slate-450 font-bold">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{prod.viewsCount} views</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex justify-center space-x-2">
                          <Link
                            to={`/admin/edit-product/${prod._id}`}
                            className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-secondary hover:text-white text-slate-500 border border-slate-200 dark:border-slate-700/60 active-press transition-colors"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          
                          <button
                            onClick={() => handleDelete(prod._id)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/15 active-press transition-colors"
                            title="Delete Product"
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
          /* Empty Catalog state */
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase">No Products Listed</h3>
            <p className="text-xs font-semibold text-slate-400 mt-1 max-w-xs mx-auto">
              Your inventory is empty. Click the New Product button to publish your first MERN product listing!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminProducts;
