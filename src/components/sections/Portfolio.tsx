'use client';

import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '@/data/mockData';
import { PortfolioItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';

interface PortfolioProps {
  onSelectProject: (project: PortfolioItem) => void;
}

const CATEGORIES = ['All', 'Performance', 'Web & App', 'Branding', 'AI & Automation'] as const;

export function Portfolio({ onSelectProject }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = activeCategory === 'All'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Featured Client Work
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Proven Results & Craftsmanship
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-extrabold leading-relaxed">
            Explore how we help high-growth SaaS, FinTech, E-Commerce, and AI companies win their categories.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2.5 mb-14 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-md text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FFE600] text-black border-2 border-black dark:border-slate-950 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFFFFF]'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-black dark:text-slate-200 hover:border-black dark:hover:border-[#FFE600]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden group cursor-pointer flex flex-col justify-between border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFE600] transition-all"
                onClick={() => onSelectProject(item)}
              >
                <div>
                  {/* Image Container with Metrics Overlay */}
                  <div className="relative h-60 overflow-hidden border-b-2 border-black dark:border-slate-700">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-md bg-[#FFE600] text-black text-[10px] font-black uppercase tracking-wider border border-black shadow-xs">
                      {item.category}
                    </span>

                    {/* Metrics Highlights Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-around p-2.5 rounded-lg bg-black text-[#FFE600] border border-black">
                      {item.metrics?.map((m) => (
                        <div key={m.label} className="text-center px-1">
                          <span className="block text-xs sm:text-sm font-black text-[#FFE600]">{m.value}</span>
                          <span className="block text-[9px] text-white font-extrabold uppercase tracking-tight truncate">
                            {m.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <span className="text-[11px] font-black text-black dark:text-[#FFE600] uppercase tracking-wider mb-1 block">
                      Client: {item.client}
                    </span>
                    <h3 className="font-heading text-xl font-black text-black dark:text-white group-hover:text-slate-800 dark:group-hover:text-[#FFE600] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-medium line-clamp-2 mb-4 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {item.tags?.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border border-black dark:border-[#FFE600] text-black dark:text-white text-[10px] font-black uppercase"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 pb-6 pt-2">
                  <div className="w-full py-2.5 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black text-xs font-black uppercase tracking-wider group-hover:bg-slate-900 dark:group-hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 border border-black dark:border-slate-950">
                    <span>View Case Strategy & Breakdown</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
