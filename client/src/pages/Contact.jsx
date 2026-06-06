import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.warning('Please fill in all form inputs');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been sent to CERIA administrators! We will respond back within 24 hours. 📩');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-secondary font-black text-xs tracking-widest uppercase block">Support Hub</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          Get in Touch
        </h1>
        <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto leading-relaxed">
          Have an enquiry about affiliate partnerships, reviews, or listing products?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Info panel (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 text-white p-8 rounded-3xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/15 rounded-full blur-2xl z-0"></div>
          
          <div className="space-y-2 relative z-10">
            <h3 className="text-xl font-black uppercase">Office Info</h3>
            <p className="text-xs font-semibold text-slate-400">CERIA HQ</p>
          </div>

          <div className="space-y-6 relative z-10 text-sm font-semibold">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-slate-300">support.ceria@gmail.com</span>
            </div>
          
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-secondary shrink-0" />
              <span className="text-slate-305">Dr. Colony, Bela, Bhandara, Maharashtra</span>
            </div>
          </div>
        </div>

        {/* Message form (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-850 dark:text-white border-b border-slate-105 dark:border-slate-800 pb-3 mb-6 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-secondary" />
            <span>Send Direct Message</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ayush Satdeve"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayush@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Product partnership enquiry..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl py-3 px-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Message</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter details of your message..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 text-sm text-slate-850 dark:text-slate-100 outline-none focus:border-secondary"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-secondary hover:bg-secondary-hover text-white py-3 px-6 rounded-xl font-bold active-press text-xs tracking-wider uppercase flex items-center space-x-2 shadow-lg shadow-secondary/15 disabled:bg-secondary/75"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;
