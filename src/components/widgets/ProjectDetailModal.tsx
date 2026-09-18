'use client';

import React from 'react';
import { PortfolioItem } from '@/types';
import { motion } from 'framer-motion';
import { X, ExternalLink, TrendingUp, CheckCircle, Sparkles } from 'lucide-react';

interface ProjectDetailModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onOpenCalendly: () => void;
}

export function ProjectDetailModal({ project, onClose, onOpenCalendly }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 max-w-3xl w-full rounded-xl p-6 sm:p-10 relative border-2 border-black dark:border-slate-700 text-left shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black border border-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-xs font-black uppercase tracking-wider mb-2 inline-block">
          {project.category} Showcase
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white mb-1">
          {project.title}
        </h2>
        <span className="text-xs font-black text-black dark:text-[#FFE600] uppercase mb-6 block">Client: {project.client}</span>

        <div className="relative h-64 rounded-xl overflow-hidden mb-6 border-2 border-black dark:border-slate-700">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Metrics Achieved Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-lg bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border-2 border-black dark:border-[#FFE600] mb-6 text-center">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <span className="block text-lg font-black text-black dark:text-[#FFE600]">{m.value}</span>
              <span className="block text-[10px] text-black dark:text-slate-200 font-extrabold uppercase">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 mb-8 text-xs sm:text-sm text-black dark:text-slate-200">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700">
            <h4 className="text-xs font-black uppercase text-black dark:text-[#FFE600] mb-1">The Challenge</h4>
            <p className="font-semibold">{project.challenge}</p>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700">
            <h4 className="text-xs font-black uppercase text-black dark:text-[#FFE600] mb-1">Our Solution & Execution</h4>
            <p className="font-semibold">{project.solution}</p>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-black dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border border-black dark:border-[#FFE600] text-black dark:text-white text-[10px] font-black uppercase">
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenCalendly();
            }}
            className="btn-gradient px-6 py-2.5 rounded-md font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000000] cursor-pointer"
          >
            Get Similar Growth
          </button>
        </div>
      </motion.div>
    </div>
  );
}
