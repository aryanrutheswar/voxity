'use client';

import React from 'react';
import { Service } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onOpenCalendly: () => void;
}

export function ServiceDetailModal({ service, onClose, onOpenCalendly }: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-xl p-6 sm:p-10 relative border-2 border-black dark:border-slate-700 text-left shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600] max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black border border-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-xs font-black uppercase tracking-wider mb-4 inline-block">
          {service.category} Discipline
        </span>

        <h2 className="text-2xl sm:text-4xl font-black text-black dark:text-white mb-4">
          {service.title}
        </h2>

        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-medium leading-relaxed mb-6">
          {service.fullDesc || service.description || service.shortDesc}
        </p>

        {/* Expected ROI Card */}
        <div className="p-4 rounded-lg bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border-2 border-black dark:border-[#FFE600] mb-6 flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-[#FFE600] border border-black text-black">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-black dark:text-[#FFE600] block">Expected Client Milestone</span>
            <span className="text-sm font-black text-black dark:text-white">{service.expectedROI || service.metrics?.value || 'High Impact Growth'}</span>
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-[#FFE600]">Included Deliverables:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(service.deliverables || service.features || []).map((del) => (
              <div key={del} className="flex items-center gap-2.5 p-3 rounded-md bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 text-xs font-bold text-black dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-black dark:text-[#FFE600] shrink-0" />
                <span>{del}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t-2 border-black dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenCalendly();
            }}
            className="w-full btn-gradient py-3.5 rounded-md font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000000]"
          >
            <span>Request {service.title} Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
