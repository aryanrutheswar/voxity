'use client';

import React, { useEffect, useState, useRef } from 'react';
import { HERO_STATS } from '../../data/mockData';
import { motion, useInView } from 'framer-motion';

function CountUp({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, end]);

  const formatted = Number.isInteger(end) ? Math.floor(count) : count.toFixed(1);

  return (
    <span ref={ref} className="font-heading font-black text-3xl sm:text-4xl text-black dark:text-white tracking-tight">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function InteractiveCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-black dark:border-slate-700 mt-12 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600]">
      {HERO_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col items-center text-center p-3 relative"
        >
          <span className="vox-badge mb-2">{i + 1}</span>
          <div className="flex items-center gap-0.5 mb-1">
            <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
          </div>
          <span className="text-xs sm:text-sm text-black dark:text-slate-200 font-extrabold uppercase tracking-wide">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
