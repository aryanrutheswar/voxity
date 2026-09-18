'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Got Questions?
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-bold leading-relaxed">
            Everything you need to know about our growth methodology, onboarding, and campaign execution.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-5">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden transition-all duration-200 border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] hover:shadow-[6px_6px_0px_#000000] dark:hover:shadow-[6px_6px_0px_#FFE600]"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="vox-badge shrink-0">{index + 1}</span>
                    <span className="text-base sm:text-lg font-black text-black dark:text-white leading-snug">
                      {item.question}
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-lg bg-[#FFE600] text-black border border-black shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base font-bold text-black dark:text-slate-300 leading-relaxed border-t-2 border-black/10 dark:border-slate-800 mt-1 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
