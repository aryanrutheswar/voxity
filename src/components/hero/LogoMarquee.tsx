'use client';

import React from 'react';
import { CLIENT_LOGOS } from '../../data/mockData';

export function LogoMarquee() {
  const logosDouble = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <div className="mt-16 pt-8 border-t-2 border-black dark:border-slate-800">
      <p className="text-center text-xs sm:text-sm font-black uppercase tracking-widest text-black dark:text-slate-300 mb-6">
        Trusted By Fast-Growing Enterprise Leaders & Global Disruptors
      </p>
      <div className="relative overflow-hidden w-full flex">
        <div className="flex gap-12 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {logosDouble.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="flex items-center gap-2 text-black dark:text-white font-black text-xl transition-transform hover:scale-105 cursor-pointer px-4 opacity-100"
            >
              <span className="text-black dark:text-white font-black">{logo.symbol}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
