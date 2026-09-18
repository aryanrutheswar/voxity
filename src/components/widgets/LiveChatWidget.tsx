'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am Vox.ity AI Assistant. How can I help you scale your business today?' }
  ]);

  const QUICK_PROMPTS = [
    'What services do you offer?',
    'How does your pricing work?',
    'Can I book a strategy call?',
    'What is your average client ROAS?'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let reply = 'Thank you for your message! One of our senior growth directors will also reach out if you leave your contact details in the Contact section.';
      const lower = query.toLowerCase();

      if (lower.includes('service')) {
        reply = 'We specialize in 11 growth disciplines: Social Media Marketing, SEO, Google PPC, Meta Ads, Brand Identity, Next.js Web Dev, Content, Email Lifecycle, AI Automation, and B2B Lead Gen!';
      } else if (lower.includes('pricing') || lower.includes('cost')) {
        reply = 'Our plans start at ₹45,000/mo for Starter Growth. We also feature an interactive package estimator tool on our Pricing section!';
      } else if (lower.includes('call') || lower.includes('book')) {
        reply = 'You can click the "Schedule Strategy Call" button at the top header to book a direct 30-min Google Meet session with our team!';
      } else if (lower.includes('roas') || lower.includes('roi')) {
        reply = 'Our clients achieve an average 4.8x ROAS across Google & Meta ad campaigns with a 98.4% client retention rate.';
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="bg-white dark:bg-slate-900 mb-4 rounded-xl w-[calc(100vw-2rem)] max-w-sm sm:w-96 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600] border-2 border-black dark:border-slate-700 overflow-hidden flex flex-col h-96 text-left"
          >
            {/* Header */}
            <div className="p-4 bg-[#FFE600] text-black border-b-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-black text-[#FFE600] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-1">
                    <span>Vox.ity AI Concierge</span>
                    <Sparkles className="w-3 h-3 text-black" />
                  </h4>
                  <span className="text-[10px] text-black font-extrabold">Instant AI Growth Intelligence</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded bg-black text-[#FFE600] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-white dark:bg-slate-900">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${
                    m.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-black ${
                      m.sender === 'user' ? 'bg-[#FFE600] text-black' : 'bg-black text-[#FFE600]'
                    }`}
                  >
                    {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3 rounded-xl max-w-[78%] leading-relaxed text-xs ${
                      m.sender === 'user'
                        ? 'bg-[#FFE600] text-black font-extrabold border border-black rounded-tr-none shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-black dark:text-white font-medium rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto bg-slate-50 dark:bg-slate-900">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-black dark:border-slate-700 hover:bg-[#FFE600] dark:hover:bg-[#FFE600] text-[10px] font-black text-black dark:text-slate-200 dark:hover:text-black whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t-2 border-black dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                placeholder="Ask AI concierge..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:outline-none focus:border-black dark:focus:border-[#FFE600]"
              />
              <button
                onClick={() => handleSend()}
                className="p-2 rounded-md btn-gradient text-black cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#FFE600] text-black border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
        aria-label="Toggle Live AI Chat Assistant"
      >
        <Bot className="w-7 h-7 text-black group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
