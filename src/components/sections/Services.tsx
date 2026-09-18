'use client';

import React, { useState } from 'react';
import { SERVICES_DATA } from '@/data/mockData';
import { Service } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2, Search, Target, TrendingUp, Palette, Layout, Code, FileText, Mail, Cpu, UserCheck, ArrowUpRight, CheckCircle, Video, Film, Zap, Sparkles, Megaphone, Camera, Play, Clapperboard
} from 'lucide-react';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Share2, Search, Target, TrendingUp, Palette, Figma: Layout, Code, FileText, Mail, Cpu, UserCheck, Video, Film, Zap, Sparkles, Megaphone, Camera, Play, Clapperboard, Instagram: Camera
};

interface ServicesProps {
  onSelectService: (service: Service) => void;
}

const CATEGORIES = ['All', 'Growth', 'Creative', 'Technology', 'AI'] as const;

export function Services({ onSelectService }: ServicesProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES_DATA);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  React.useEffect(() => {
    fetch('/api/cms')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.services) {
          setServicesList(data.data.services);
        }
      })
      .catch((err) => console.error('Failed to fetch CMS services', err));
  }, []);

  const filteredServices = activeCategory === 'All'
    ? servicesList
    : servicesList.filter((s) => s.category === activeCategory);

  return (
    <section id="services" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            What We Do
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Services We Provide
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
            Comprehensive digital marketing, Instagram ad boosting, video editing, performance ads, and result-driven growth solutions for your brand.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center gap-2.5 mb-16 flex-wrap">
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

        {/* Services Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredServices.map((service, index) => {
              const IconComponent = ICON_MAP[service.iconName] || Share2;
              const hasValidImage = Boolean(service.image) && !failedImages[service.id];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  key={service.id}
                  className="bg-white dark:bg-slate-900 rounded-xl flex flex-col justify-between group relative border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFE600] transition-all overflow-hidden"
                >
                  {/* Card Header Image with Overlay & Error Fallback */}
                  {hasValidImage ? (
                    <div className="relative h-44 w-full overflow-hidden border-b-2 border-black dark:border-slate-800 bg-slate-900">
                      <img
                        src={service.image}
                        alt={service.title}
                        onError={() => handleImageError(service.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-3 left-4 w-10 h-10 rounded-lg bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000] z-10">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {service.badge && (
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000] z-10">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-28 w-full bg-gradient-to-r from-slate-900 via-slate-800 to-black border-b-2 border-black dark:border-slate-800 p-4 flex items-end justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {service.badge && (
                        <span className="px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000000]">
                          {service.badge}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                    <div>
                      {/* Fallback Icon if no image */}
                      {!service.image && (
                        <div className="w-12 h-12 rounded-lg bg-black dark:bg-[#FFE600] text-[#FFE600] dark:text-black flex items-center justify-center mb-6">
                          <IconComponent className="w-5 h-5" />
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="font-heading text-xl font-black text-black dark:text-white mb-2">
                        {service.title}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-6 leading-relaxed font-medium">
                        {service.shortDesc}
                      </p>

                      {/* Key Features Quick Checklist */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                        {service.features.slice(0, 3).map((feat) => (
                          <div key={feat} className="flex items-center gap-2 text-xs text-black dark:text-slate-200 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5 text-black dark:text-[#FFE600] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action & Expected ROI */}
                    <div>
                      <div className="p-3 rounded-lg bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border border-black dark:border-[#FFE600] mb-4">
                        <span className="text-[10px] font-black text-black dark:text-[#FFE600] uppercase tracking-wider block mb-0.5">Target Benchmark</span>
                        <span className="text-xs font-black text-black dark:text-white truncate block">
                          {service.expectedROI}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectService(service)}
                        className="w-full py-2.5 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black text-xs font-black uppercase tracking-wider hover:bg-slate-900 dark:hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Explore Deliverables & Scope</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
