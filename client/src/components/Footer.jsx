import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to CERIA newsletter! 🚀');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0A0617] text-slate-400 border-t border-[#c084fc]/15 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-white text-2xl font-black tracking-wider flex items-center space-x-1">
              <span>CERIA</span>
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#8B3DFF] to-[#C084FC]"></span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Your ultimate premium destination for discovering high-rated, handpicked products across Amazon, Flipkart, Meesho, Myntra, and Ajio. We compare and curate the best deals for you.
            </p>
            <span className="text-xs font-semibold uppercase bg-indigo-950/40 text-[#C084FC] px-3 py-1 rounded-full border border-[#8B3DFF]/20 block w-max">
              Affiliate AI Agent
            </span>
          </div>

          {/* Categories Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider">Shop Departments</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/products?category=Electronics" className="hover:text-secondary transition-colors">Consumer Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-secondary transition-colors">Trending Fashion</Link></li>
              <li><Link to="/products?category=Shoes" className="hover:text-secondary transition-colors">Premium Footwear</Link></li>
              <li><Link to="/products?category=Beauty" className="hover:text-secondary transition-colors">Skin Care & Beauty</Link></li>
              <li><Link to="/products?category=Furniture" className="hover:text-secondary transition-colors">Home & Office Furniture</Link></li>
            </ul>
          </div>

          {/* Company Pages */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 uppercase tracking-wider">Useful Info</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/about" className="hover:text-secondary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">Get in Touch</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-secondary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base uppercase tracking-wider">Join Newsletter</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to get notified about special handpicked price drops, curated lists, and exclusive affiliate discount deals!
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#140B2D] border border-[#c084fc]/15 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-[#C084FC] transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1.5 btn-primary-gradient text-white rounded-lg transition-colors border border-transparent"
              >
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Footer bottom */}
        <div className="border-t border-[#c084fc]/15 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-semibold space-y-4 md:space-y-0">
          <p>© {currentYear} CERIA Affiliate Platform. All rights reserved.</p>
          <div className="flex items-center space-x-1.5">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>using the MERN Stack.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
