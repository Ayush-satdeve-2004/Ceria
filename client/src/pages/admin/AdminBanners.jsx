import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit2, Trash2, Save, FileImage, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AdminSidebar from '../../components/AdminSidebar';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editId, setEditId] = useState(null); // Null means Add Mode
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('');
  const [cta, setCta] = useState('Explore Deal');
  const [link, setLink] = useState('/');
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState('');

  // Fetch all banners on mount
  const fetchBanners = async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      // Fetch all banners including inactive ones (admin=true)
      const res = await axios.get('/api/banners?admin=true');
      if (res.data.success) {
        setBanners(res.data.banners);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load banner list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners(false);
  }, []);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setSubtitle('');
    setBadge('');
    setCta('Explore Deal');
    setLink('/');
    setActive(true);
    setImageFile(null);
    setExistingImage('');
  };

  const handleEditInit = (banner) => {
    setEditId(banner._id);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setBadge(banner.badge || '');
    setCta(banner.cta || 'Explore Deal');
    setLink(banner.link || '/');
    setActive(banner.active ?? true);
    setExistingImage(banner.image || '');
    setImageFile(null);
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner slide?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(`/api/banners/${bannerId}`);
      if (res.data.success) {
        toast.success(res.data.message || 'Banner slide removed');
        if (editId === bannerId) {
          resetForm();
        }
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      toast.warning('Please enter a banner title.');
      return;
    }

    if (!imageFile && !editId) {
      toast.warning('Please select a slide banner image to upload.');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('badge', badge);
      formData.append('cta', cta);
      formData.append('link', link);
      formData.append('active', String(active));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      let res;
      if (editId) {
        res = await axios.put(`/api/banners/${editId}`, formData, config);
      } else {
        res = await axios.post('/api/banners', formData, config);
      }

      if (res.data.success) {
        toast.success(res.data.message || 'Banner slide saved successfully!');
        resetForm();
        fetchBanners();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload banner');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-bgDark">
      <AdminSidebar />

      <div className="flex-grow p-6 lg:p-10 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200/50 dark:border-slate-800/80 pb-5">
          <h1 className="text-3xl font-black text-slate-850 dark:text-white uppercase tracking-tight">
            Homepage Hero Banners
          </h1>
          <p className="text-xs font-semibold text-slate-455 mt-1">
            Create, modify, and manage custom image slides to display in the main homepage hero banner carousel.
          </p>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Add / Edit Form Panel */}
          <div className="xl:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-4 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-secondary" />
              <span>{editId ? 'Modify Banner Slide' : 'Add Banner Slide'}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unmatched Premium Footwear Style"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. From elite athletic training sneakers to daily casual runners."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-xs text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                ></textarea>
              </div>

              {/* Badge Text */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Badge Text (Mini-header)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. 50% AFFILIATE CASHBACK BONANZA"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* CTA Button Text */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CTA Button Label</label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g. Shop Footwear"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                  />
                </div>

                {/* Link / URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Redirect Destination Link</label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g. /products?category=Shoes"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-xs text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Banner Image file upload */}
              <div className="space-y-1.5 border border-dashed border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/20">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer">
                  <FileImage className="w-4 h-4 text-secondary" />
                  <span>Banner Image File {editId ? '(Optional)' : '*'}</span>
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => setImageFile(e.target.files[0] || null)}
                  className="text-xs file:bg-slate-200 dark:file:bg-slate-800 file:border-0 file:py-1.5 file:px-3 file:rounded-lg file:font-extrabold file:text-xs text-slate-400 file:cursor-pointer w-full"
                />
                <p className="text-[9px] text-slate-400 font-medium">Use a high quality wide image (Recommended: 1600x600 px).</p>
                {existingImage && !imageFile && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[9px] font-bold text-slate-500">Current Image:</span>
                    <img src={existingImage} alt="Current banner" className="w-20 h-10 rounded object-cover border" />
                  </div>
                )}
                {imageFile && (
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-[9px] font-bold text-secondary">New Preview:</span>
                    <img src={URL.createObjectURL(imageFile)} alt="New preview" className="w-20 h-10 rounded object-cover border border-secondary" />
                  </div>
                )}
              </div>

              {/* Status active */}
              <div className="flex items-center space-x-2 p-2">
                <input
                  type="checkbox"
                  id="active-toggle"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-secondary border-slate-300 rounded focus:ring-secondary cursor-pointer"
                />
                <label htmlFor="active-toggle" className="text-xs font-bold text-slate-650 dark:text-slate-300 cursor-pointer select-none">
                  Publish slide live immediately (Active)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 py-2.5 px-4 rounded-xl font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto bg-secondary hover:bg-secondary-hover text-white py-3 px-6 rounded-xl font-bold active-press text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-secondary/15 disabled:opacity-70"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editId ? 'Update Slide' : 'Publish Slide'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Banner List & Preview Panel */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-4">
                Active & Draft Slides
              </h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-2xl p-6">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">No Custom Banners Configured</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                    Without custom banner slides, the homepage will display the system defaults. Upload a banner image to customize your storefront slider!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.map((b) => (
                    <div
                      key={b._id}
                      className={`relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl border transition-all ${
                        b.active
                          ? 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/60'
                          : 'border-amber-200 bg-amber-500/5 dark:border-amber-950/20'
                      }`}
                    >
                      {/* Banner Image Preview Container */}
                      <div className="w-full md:w-44 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-950/20 relative border dark:border-slate-800">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                        {!b.active && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[8px] tracking-wider uppercase">
                            Draft / Hidden
                          </span>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="flex-grow flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            {b.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-secondary/15 text-secondary text-[8px] font-black uppercase tracking-wider">
                                {b.badge}
                              </span>
                            )}
                            <span className="text-[9px] font-bold text-slate-400">Target: {b.link}</span>
                          </div>
                          <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight mt-1">
                            {b.title}
                          </h3>
                          {b.subtitle && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                              {b.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-2 text-[10px] font-bold text-slate-400">
                          <span>CTA Label: "{b.cta}"</span>
                          
                          {/* Slide Actions */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditInit(b)}
                              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-secondary dark:hover:text-white transition-colors"
                              title="Edit slide"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(b._id)}
                              className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors"
                              title="Delete slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
