'use client';

import React, { useState, useEffect } from 'react';
import { TESTIMONIALS } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle } from 'lucide-react';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!TESTIMONIALS || TESTIMONIALS.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (!TESTIMONIALS || TESTIMONIALS.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    if (!TESTIMONIALS || TESTIMONIALS.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS && TESTIMONIALS.length > 0 ? TESTIMONIALS[currentIndex] : null;

  if (!current) return null;

  return (
    <section id="testimonials" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Client Endorsements
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Trusted By Industry-Leading Execs & Founders
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-extrabold leading-relaxed">
            Hear directly from the CMOS, CEOs, and VP of Growth scaling with Aetheris Digital.
          </p>
        </div>

        {/* Testimonial Carousel Card */}
        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-xl relative border-2 border-black dark:border-slate-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600]"
            >
              <Quote className="absolute top-6 right-8 w-16 h-16 text-black/10 dark:text-white/10 pointer-events-none" />

              {/* Rating Stars & Verified Badge */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FFE600] text-black stroke-2" />
                  ))}
                </div>

                {current.verified && (
                  <span className="px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-black" /> Verified Client Audit
                  </span>
                )}
              </div>

              {/* Quote Content */}
              <p className="text-lg sm:text-2xl font-black text-black dark:text-white leading-relaxed mb-8 tracking-tight">
                "{current.content}"
              </p>

              {/* Key Result Banner */}
              <div className="p-3 rounded-lg bg-[#FFE600] border border-black mb-8 inline-block shadow-[2px_2px_0px_#000000]">
                <span className="text-xs font-black text-black uppercase tracking-wider">
                  Key Result: {current.resultsAchieved}
                </span>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 border-t-2 border-black/10 dark:border-slate-800 pt-6">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-black dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h4 className="text-lg font-black text-black dark:text-white">{current.name}</h4>
                  <p className="text-xs text-black dark:text-[#FFE600] font-extrabold uppercase">
                    {current.role}, <span className="underline">{current.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-3 rounded-full transition-all duration-300 cursor-pointer border border-black dark:border-slate-700 ${
                    currentIndex === i
                      ? 'w-8 bg-[#FFE600]'
                      : 'w-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="p-3 rounded-md bg-white dark:bg-slate-900 border-2 border-black dark:border-slate-700 text-black dark:text-white hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600]"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-md bg-white dark:bg-slate-900 border-2 border-black dark:border-slate-700 text-black dark:text-white hover:bg-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600]"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
