'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative p-2 rounded-lg bg-black text-[#FFE600] dark:bg-slate-800 dark:text-[#FFE600] border-2 border-black dark:border-slate-700 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600] flex items-center justify-center"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-[#FFE600] stroke-[2.5]" />
        ) : (
          <Moon className="w-4 h-4 text-[#FFE600] stroke-[2.5]" />
        )}
      </motion.div>
    </button>
  );
}

