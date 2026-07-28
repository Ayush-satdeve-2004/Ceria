import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Sparkles, Send, X, Mic, MicOff,
  ShoppingBag, HelpCircle, ArrowRight, RefreshCw, BarChart2
} from 'lucide-react';
import axios from 'axios';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am Ceria, your intelligent shopping agent. I can help you find, compare, and recommend premium products instantly. What are you looking for today?",
      time: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Listen for the custom toggle-ceria-chat event
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('toggle-ceria-chat', handleToggle);
    return () => window.removeEventListener('toggle-ceria-chat', handleToggle);
  }, []);

  // Auto Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputVal.trim();
    if (!queryText) return;

    if (!textToSend) setInputVal('');

    // Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // AI smart processing mock rules
    setTimeout(async () => {
      let replyText = "I'm analyzing our catalog for you...";
      let productsList = [];
      const lowerQuery = queryText.toLowerCase();

      try {
        // Simple search query based on nouns/keywords
        let searchKeyword = '';
        if (lowerQuery.includes('laptop') || lowerQuery.includes('computer')) searchKeyword = 'Electronics';
        else if (lowerQuery.includes('shoe') || lowerQuery.includes('sneaker')) searchKeyword = 'Shoes';
        else if (lowerQuery.includes('shirt') || lowerQuery.includes('dress') || lowerQuery.includes('fashion')) searchKeyword = 'Fashion';
        else if (lowerQuery.includes('chair') || lowerQuery.includes('furniture') || lowerQuery.includes('table')) searchKeyword = 'Furniture';
        else if (lowerQuery.includes('phone') || lowerQuery.includes('mobile')) searchKeyword = 'Mobiles';
        else if (lowerQuery.includes('accessory') || lowerQuery.includes('bag')) searchKeyword = 'Accessories';
        else {
          // Fallback - check individual words
          const words = lowerQuery.split(/\s+/);
          const stopWords = ['a', 'an', 'the', 'for', 'buy', 'shop', 'find', 'me', 'want', 'to', 'best', 'cheap', 'with', 'under', 'premium'];
          const keyword = words.find(w => w.length > 3 && !stopWords.includes(w));
          if (keyword) searchKeyword = keyword;
        }

        if (searchKeyword) {
          const res = await axios.get(`/api/products?search=${encodeURIComponent(searchKeyword)}&limit=3`);
          if (res.data.success && res.data.products?.length > 0) {
            productsList = res.data.products;
          }
        }
      } catch (err) {
        console.error('AI search helper error:', err);
      }

      // Generate conversational text matching user intents
      if (lowerQuery.includes('compare')) {
        replyText = "Here are top products you can compare in detail. Let me know if you would like me to summarize the reviews for these:";
      } else if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('price')) {
        replyText = "I've analyzed your interest in value-driven deals. Here are budget-optimized suggestions from our list:";
      } else if (lowerQuery.includes('trend') || lowerQuery.includes('popular')) {
        replyText = "Here is the trending analysis on items drawing high visitor volume this week:";
      } else if (productsList.length > 0) {
        replyText = `Excellent choice! I found some premium ${productsList[0].category} items for you:`;
      } else {
        replyText = "I'm on it! I can help you find products, check direct affiliate links, compare specs, or run a budget-based search. Tell me what type of electronics, fashion, or shoes you're browsing.";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: replyText,
        products: productsList,
        time: new Date()
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const startVoiceSearch = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    // Mock speech recognition trigger
    setTimeout(() => {
      if (isListening) return; // if turned off manually
      const mockPhrases = [
        "Find running shoes under 2000",
        "Compare top rated laptops",
        "Show latest arrivals in electronics",
        "Are there any trending furniture items?"
      ];
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setInputVal(randomPhrase);
      setIsListening(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating launcher badge icon */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Ceria AI Agent chat"
          className="relative group p-4 rounded-full bg-gradient-to-tr from-[#8B3DFF] to-[#C084FC] text-white shadow-[0_0_20px_rgba(139,61,255,0.4)] hover:shadow-[0_0_30px_rgba(192,132,252,0.65)] hover:scale-110 active-press transition-all duration-300 flex items-center justify-center"
        >
          <span className="absolute -inset-0.5 rounded-full bg-[#C084FC] opacity-30 blur group-hover:opacity-75 transition duration-500 animate-pulse"></span>
          <Sparkles className="w-6 h-6 relative z-10 animate-spin-slow" />
        </button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-[#0A0617] border-l border-[#c084fc]/20 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Luxury Purple Glowing Backdrop Particle */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#8B3DFF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#5B21B6]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

              {/* Chat Header */}
              <div className="relative px-6 py-4 bg-[#140B2D]/80 border-b border-[#c084fc]/15 backdrop-blur-md flex items-center justify-between z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8B3DFF] to-[#C084FC] flex items-center justify-center shadow-lg shadow-[#8B3DFF]/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm tracking-wide flex items-center space-x-1.5 uppercase">
                      <span>Ceria AI Agent</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h3>
                    <p className="text-xs text-[#B8B8C7] font-medium">Next-Gen Shopping Intelligence</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-[#E5E7EB] transition-colors"
                  aria-label="Close Assistant panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Suggestions Chips Area */}
              <div className="px-4 py-2 bg-[#0A0617] border-b border-[#c084fc]/10 flex space-x-2 overflow-x-auto scrollbar-none z-10 shrink-0">
                <button
                  onClick={() => handleSendMessage("Compare laptops")}
                  className="px-3 py-1.5 rounded-full bg-[#140B2D] border border-[#c084fc]/15 text-[11px] font-bold text-[#E5E7EB] hover:bg-[#8B3DFF]/20 hover:border-[#8B3DFF] transition-all shrink-0 flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Compare Products</span>
                </button>
                <button
                  onClick={() => handleSendMessage("Recommend budget products")}
                  className="px-3 py-1.5 rounded-full bg-[#140B2D] border border-[#c084fc]/15 text-[11px] font-bold text-[#E5E7EB] hover:bg-[#8B3DFF]/20 hover:border-[#8B3DFF] transition-all shrink-0 flex items-center space-x-1"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Budget Suggestions</span>
                </button>
                <button
                  onClick={() => handleSendMessage("What is trending?")}
                  className="px-3 py-1.5 rounded-full bg-[#140B2D] border border-[#c084fc]/15 text-[11px] font-bold text-[#E5E7EB] hover:bg-[#8B3DFF]/20 hover:border-[#8B3DFF] transition-all shrink-0 flex items-center space-x-1"
                >
                  <BarChart2 className="w-3 h-3" />
                  <span>Trend Analysis</span>
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent z-10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="text-[10px] text-slate-500 font-semibold mb-1">
                      {msg.sender === 'user' ? 'You' : 'Ceria AI'} • {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#2A174D] text-white rounded-tr-none border border-[#8B3DFF]/20'
                          : 'bg-[#8B3DFF] text-white rounded-tl-none shadow-lg shadow-[#8B3DFF]/15'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Display Products Inside Chat */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-3.5 space-y-2.5">
                          {msg.products.map(prod => (
                            <div 
                              key={prod._id}
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/products/${prod._id}`);
                              }}
                              className="flex items-center space-x-3 bg-[#140B2D]/80 hover:bg-[#201345] p-2 rounded-xl border border-[#c084fc]/25 cursor-pointer transition-all duration-300"
                            >
                              <img 
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1549462184-b09ad0a4af67?w=80'} 
                                alt={prod.name}
                                className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                              />
                              <div className="flex-grow min-w-0">
                                <h4 className="text-[11px] font-black text-white truncate">{prod.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-[10px] font-extrabold text-[#C084FC]">${prod.price.toLocaleString('en-US')}</span>
                                  <span className="text-[9px] font-semibold text-slate-400 bg-black/40 px-1.5 py-0.5 rounded uppercase">
                                    {prod.sourcePlatform}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex flex-col items-start">
                    <div className="text-[10px] text-slate-500 font-semibold mb-1">Ceria AI • Typing...</div>
                    <div className="bg-[#8B3DFF] text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-lg shadow-[#8B3DFF]/10 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input form footer */}
              <div className="relative p-4 bg-[#140B2D]/80 border-t border-[#c084fc]/15 backdrop-blur-md z-10 shrink-0">
                {isListening && (
                  <div className="absolute top-0 left-0 right-0 -translate-y-full bg-[#8B3DFF]/90 text-white text-xs px-4 py-2 flex items-center justify-between animate-pulse">
                    <span className="font-bold flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                      <span>Active voice listening... Speak now</span>
                    </span>
                    <button 
                      onClick={() => setIsListening(false)}
                      className="text-white font-bold hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center space-x-2"
                >
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className={`p-2.5 rounded-xl border transition-colors shrink-0 flex items-center justify-center ${
                      isListening 
                        ? 'bg-red-500/20 border-red-500 text-red-500' 
                        : 'bg-white/5 border-[#c084fc]/10 text-slate-400 hover:text-white'
                    }`}
                    title={isListening ? 'Stop Listening' : 'Voice Search'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Ask Ceria to compare, find, recommend..."
                    className="flex-grow bg-[#0A0617] border border-[#c084fc]/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-550 focus:border-[#C084FC] outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#C084FC] hover:bg-[#b074ec] text-[#0A0617] transition-all flex items-center justify-center shadow-lg shadow-[#C084FC]/25 hover:shadow-[#C084FC]/40 shrink-0"
                    title="Send Message"
                  >
                    <Send className="w-4 h-4 fill-current" />
                  </button>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
