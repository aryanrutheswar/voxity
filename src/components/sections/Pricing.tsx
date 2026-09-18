'use client';

import React, { useState } from 'react';
import { PRICING_PLANS } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Calculator, ArrowRight, Sliders } from 'lucide-react';

interface PricingProps {
  onOpenCalendly: () => void;
}

export function Pricing({ onOpenCalendly }: PricingProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  // Custom Package Calculator & Budget Slider state (₹5k to ₹10 Lakhs)
  const [targetBudget, setTargetBudget] = useState<number>(250000);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['SEO', 'Google Ads']);

  const CHANNELS = [
    { id: 'SEO', name: 'Search Engine Optimization', cost: 25000 },
    { id: 'Google Ads', name: 'Google Search & Shopping', cost: 25000 },
    { id: 'Meta Ads', name: 'Meta & Instagram Paid Scale', cost: 25000 },
    { id: 'Web Dev', name: 'Next.js Custom Development', cost: 35000 },
    { id: 'AI Agents', name: 'Autonomous AI Workflows', cost: 30000 },
  ];

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const calculatedCost = selectedChannels.reduce((acc, channelId) => {
    const found = CHANNELS.find((c) => c.id === channelId);
    return acc + (found ? found.cost : 0);
  }, 0);

  const formatBudgetDisplay = (amount: number) => {
    if (amount === 0) return '₹0';
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(1).replace('.0', '');
      return `₹${lakhs} Lakh${Number(lakhs) > 1 ? 's' : ''}`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Transparent Pricing & Custom Estimator
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Invest in Predictable Revenue Growth
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
            No hidden fees. Full account ownership. Flexible rolling commitments.
          </p>

          {/* Monthly / Annual Billing Switch */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-extrabold uppercase ${!isAnnual ? 'text-black dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-black dark:border-slate-700 p-1 transition-colors cursor-pointer"
              aria-label="Toggle Billing Interval"
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-[#FFE600] border border-black shadow-sm"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-extrabold uppercase flex items-center gap-1.5 ${isAnnual ? 'text-black dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-md bg-[#FFE600] border border-black text-black text-[10px] font-black">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 items-stretch">
          {PRICING_PLANS.map((plan, i) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 flex flex-col justify-between relative border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] ${
                  plan.popular
                    ? 'lg:scale-105 z-20 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600]'
                    : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-md bg-[#FFE600] border-2 border-black text-black text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Recommended Choice
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-2xl font-black text-black dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mb-6">{plan.tagline}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-heading text-4xl sm:text-5xl font-black text-black dark:text-white">₹{price.toLocaleString('en-IN')}</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">/ month</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-black uppercase tracking-wider text-black dark:text-[#FFE600] block mb-2">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-black dark:text-slate-200 font-semibold">
                        <Check className="w-4 h-4 text-black dark:text-[#FFE600] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded && plan.notIncluded.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-400 dark:text-slate-600 line-through font-medium">
                        <X className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenCalendly}
                  className={`w-full py-3.5 rounded-md font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'btn-gradient text-black'
                      : 'bg-white dark:bg-slate-900 border-2 border-black dark:border-slate-700 text-black dark:text-white hover:bg-black hover:text-[#FFE600] dark:hover:bg-[#FFE600] dark:hover:text-black'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Custom Package Estimator Calculator Widget */}
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-xl max-w-4xl mx-auto border-2 border-black dark:border-slate-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-[#FFE600] border-2 border-black text-black">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading text-2xl font-black text-black dark:text-white">
                Interactive Custom Budget & Package Estimator
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-300 font-medium">
                Adjust your monthly marketing budget from <strong className="bg-[#FFE600] text-black px-1 font-black">₹5k to ₹10 Lakhs</strong> and select desired growth modules.
              </p>
            </div>
          </div>

          {/* Interactive Budget Range Slider (₹5k to ₹10 Lakhs) */}
          <div className="mb-8 p-6 rounded-xl bg-[#FFE600]/15 dark:bg-[#FFE600]/10 border-2 border-black dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-black dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-black dark:text-[#FFE600]" />
                Adjust Target Monthly Budget (₹5k to ₹10 Lakhs)
              </label>
              <span className="font-heading text-xl font-black text-black bg-[#FFE600] px-3 py-1 rounded-md border border-black shadow-xs">
                {formatBudgetDisplay(targetBudget)}
              </span>
            </div>

            <input
              type="range"
              min="5000"
              max="1000000"
              step="5000"
              value={targetBudget}
              onChange={(e) => setTargetBudget(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-[#FFE600]"
            />

            <div className="flex items-center justify-between text-[11px] text-black dark:text-slate-300 font-extrabold uppercase pt-1">
              <span>₹5k</span>
              <span>₹2.5 Lakhs</span>
              <span>₹5.0 Lakhs</span>
              <span>₹7.5 Lakhs</span>
              <span>₹10.0 Lakhs+</span>
            </div>
          </div>

          {/* Module Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {CHANNELS.map((ch) => {
              const isSelected = selectedChannels.includes(ch.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFE600] border-black text-black font-black shadow-[2px_2px_0px_#000000]'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-black dark:hover:border-[#FFE600]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black">{ch.id}</span>
                    <span className="text-[10px] font-black">+₹{ch.cost.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[11px] font-semibold block truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Live Estimate Footer */}
          <div className="p-6 rounded-xl bg-black dark:bg-slate-950 text-[#FFE600] border border-black dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#FFE600] font-extrabold uppercase block tracking-wider">Estimated Monthly Module Total</span>
              <span className="font-heading text-3xl font-black text-white">₹{calculatedCost.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ month</span></span>
            </div>

            <button
              onClick={onOpenCalendly}
              className="btn-gradient px-6 py-3 rounded-md text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer"
            >
              <span>Request Custom Proposal ({formatBudgetDisplay(targetBudget)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
