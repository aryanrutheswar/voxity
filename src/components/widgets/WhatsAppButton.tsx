'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSend = () => {
    const text = encodeURIComponent(msg || 'Hi Vox.ity, I would like to inquire about your marketing services.');
    window.open(`https://wa.me/18004589210?text=${text}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass-card mb-4 p-5 rounded-2xl w-[calc(100vw-2rem)] max-w-xs sm:w-80 shadow-2xl border border-emerald-500/30 text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                    WA
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Vox.ity WhatsApp Support</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">Online • Replies instantly</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
                👋 Hi there! Looking for a fast revenue audit or marketing quote? Message our direct team below:
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 group"
        aria-label="Contact via WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-slate-950 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
