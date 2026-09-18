'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-16 sm:pt-44 sm:pb-24 overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Vox Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFE600] border-2 border-black text-black text-xs sm:text-sm font-black uppercase tracking-wider mb-6 shadow-[3px_3px_0px_#000000]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
          <span>Welcome to Vox.ity Digital Marketing</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black text-black dark:text-white tracking-tight leading-tight"
        >
          Welcome to Vox.ity Digital Marketing
        </motion.h1>
      </div>
    </section>
  );
}