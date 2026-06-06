import React from 'react';
import { Target, HelpCircle, ShieldCheck, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-secondary font-black text-xs tracking-widest uppercase block">Who We Are</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
          About CERIA Affiliate
        </h1>
        <p className="text-sm font-semibold text-slate-400 max-w-xl mx-auto leading-relaxed">
          The ultimate unified affiliate curation e-commerce platform designed for modern, smart online shoppers.
        </p>
      </div>

      {/* Main Grid description */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-105 dark:border-slate-800/80 shadow-sm leading-relaxed space-y-6">
        <h3 className="text-lg font-black text-slate-850 dark:text-white uppercase">Our Core Mission</h3>
        <p className="text-sm text-slate-650 dark:text-slate-350">
CERIA is an AI-powered shopping agent and unified e-commerce discovery platform built for modern consumers who want a smarter, faster, and more efficient online shopping experience. Unlike traditional e-commerce websites that sell products directly, CERIA acts as an intelligent shopping assistant that continuously searches, analyzes, compares, and curates products from multiple trusted online marketplaces, bringing the best options together in one centralized platform. Our mission is to eliminate the need for users to browse countless shopping applications and websites individually by providing a single destination where they can discover, compare, and access high-quality products with ease.        </p>
        <p className="text-sm text-slate-650 dark:text-slate-350">
          When you click 'Buy Now' or sAt CERIA, we believe that online shopping should be simple, transparent, and intelligent. Every day, millions of shoppers spend valuable time comparing prices, reading reviews, checking product ratings, and searching for the best deals across multiple platforms. CERIA solves this problem by functioning as a powerful shopping agent that helps users make informed purchasing decisions. Through advanced search technology, smart product analysis, and intelligent recommendation systems, CERIA identifies relevant products from leading marketplaces such as Amazon, Flipkart, Meesho, Myntra, Ajio, and other trusted retail partners, allowing users to explore a wide range of options without leaving the platform.elect multiple items from your cart to checkout, our platform safely records your redirection statistics and opens direct portal links for final purchases. We earn small commission percentages from merchants at no added expense to you!
        </p>
         <p className="text-sm text-slate-650 dark:text-slate-350">
          What makes CERIA unique is its agent-based shopping approach. Instead of simply displaying products, CERIA actively works on behalf of users by analyzing product quality, ratings, popularity, pricing trends, discounts, seller credibility, and overall customer satisfaction. This allows shoppers to discover products that offer the best value, quality, and reliability. Whether users are searching for electronics, fashion, footwear, home essentials, beauty products, accessories, gadgets, or lifestyle items, CERIA acts as a personal shopping companion that simplifies the entire discovery process and helps users find products that match their needs, preferences, and budget.

         </p>
          <p className="text-sm text-slate-650 dark:text-slate-350">
            CERIA is committed to providing a transparent shopping environment. The platform does not add hidden charges, inflate prices, or impose unnecessary service fees. Product pricing displayed on CERIA reflects the pricing available on partner marketplaces whenever possible, ensuring users receive accurate and trustworthy information. By consolidating product data from multiple sources, CERIA enables shoppers to compare options more efficiently and identify the best available deals, discounts, and offers in real time.

          </p>
          <p className="text-sm text-slate-650 dark:text-slate-350">
            When users decide to purchase a product, CERIA provides secure redirection to the official marketplace where the final transaction takes place. This approach ensures that customers benefit from the security, payment infrastructure, buyer protection policies, return systems, warranties, and customer support provided by established e-commerce platforms. CERIA itself does not process payments for third-party marketplace products; instead, it serves as an intelligent bridge between consumers and trusted online retailers.

          </p>
            <p className="text-sm text-slate-650 dark:text-slate-350">
              To support platform operations and continuous innovation, CERIA participates in affiliate and partnership programs with selected merchants and marketplaces. When users make purchases through referral links generated by CERIA, the platform may receive a small commission from the merchant. This commission comes directly from the marketplace and does not increase the product price or create any additional cost for the customer. This business model allows CERIA to maintain and improve its services while continuing to provide a free and valuable shopping experience for users.

            </p>
            <p className="text-sm text-slate-650 dark:text-slate-350">
              Our long-term vision is to build the world's most intelligent shopping agent—one that not only helps users find products but also understands preferences, predicts needs, monitors price changes, identifies emerging trends, and delivers highly personalized shopping recommendations. By combining artificial intelligence, data-driven insights, marketplace integration, and user-focused innovation, CERIA aims to transform online shopping from a time-consuming task into a seamless and enjoyable experience.

              </p>
               <p className="text-sm text-slate-650 dark:text-slate-350">
                CERIA is more than an e-commerce platform—it is your intelligent shopping agent, working continuously to help you discover better products, compare smarter, save time, and shop with confidence.

              </p>
      </div>

      {/* Grid boxes features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3">
          <Target className="w-8 h-8 text-secondary" />
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase">Target Curations</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Only top-rated, premium quality tech, fashion, shoes, and home accessories make it into the catalog.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3">
          <HelpCircle className="w-8 h-8 text-amber-500" />
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase">Zero Extra Charges</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            We list direct merchant pricing. Buyers enjoy clean price drops and cashback offers without any platform surcharges.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase">Secure Redirections</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold">
            Our multi-tab redirect flow is highly optimized and protects user browsing contexts at all times.
          </p>
        </div>

      </div>

    </div>
  );
};

export default About;
