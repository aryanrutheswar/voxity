'use client';

import React, { useState } from 'react';
import { CASE_STUDIES } from '@/data/mockData';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, Quote } from 'lucide-react';

export function CaseStudies() {
  const [activeTab, setActiveTab] = useState(0);
  const [studiesList, setStudiesList] = useState(CASE_STUDIES);

  React.useEffect(() => {
    fetch('/api/cms')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data?.caseStudies) {
          setStudiesList(data.data.caseStudies);
        }
      })
      .catch((err) => console.error('Failed to fetch CMS case studies', err));
  }, []);

  const activeStudy = studiesList && studiesList.length > 0 ? (studiesList[activeTab] || studiesList[0]) : null;

  return (
    <section id="case-studies" className="py-24 sm:py-32 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Verified Proof & Results
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            How We Scaled Clients to Category Leadership
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-extrabold leading-relaxed">
            Detailed breakdowns of strategic challenges, tactical execution, and verified financial outcomes.
          </p>
        </div>

        {/* Case Study Selector Tabs */}
        <div className="flex items-center justify-center gap-2.5 mb-14 flex-wrap">
          {studiesList.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => setActiveTab(idx)}
              className={`px-5 py-2.5 rounded-md text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === idx
                  ? 'bg-[#FFE600] text-black border-2 border-black dark:border-slate-950 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFFFFF]'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-black dark:text-slate-200 hover:border-black dark:hover:border-[#FFE600]'
              }`}
            >
              <span>{cs.clientName}</span>
              <span className="text-[10px] opacity-80">({cs.industry})</span>
            </button>
          ))}
        </div>

        {/* Selected Case Study Active Highlight Card */}
        {activeStudy && (
          <motion.div
            key={activeStudy.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-xl border-2 border-black dark:border-slate-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Client Overview & Verified Metrics */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-black bg-[#FFE600] px-2.5 py-1 rounded-md border border-black inline-block mb-3">
                    {activeStudy.industry} • Case Study
                  </span>
                  <h3 className="font-heading text-3xl sm:text-4xl font-black text-black dark:text-white mb-2">
                    {activeStudy.clientName}
                  </h3>
                  {activeStudy.duration && (
                    <p className="text-xs text-black dark:text-slate-300 font-extrabold font-mono">
                      Duration: {activeStudy.duration}
                    </p>
                  )}
                </div>

                {/* Verified Metric Numbers Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  {activeStudy.results && activeStudy.results.map((m) => (
                    <div key={m.metric} className="p-4 rounded-lg bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border-2 border-black dark:border-[#FFE600] shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600]">
                      <span className="font-heading text-2xl sm:text-3xl font-black text-black dark:text-[#FFE600] block mb-1">
                        {m.growth}
                      </span>
                      <span className="text-xs text-black dark:text-slate-200 font-extrabold block leading-tight">
                        {m.metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Challenge, Strategy & Results */}
              <div className="lg:col-span-7 space-y-6 pl-0 lg:pl-6 border-t-2 lg:border-t-0 lg:border-l-2 border-black dark:border-slate-800 pt-6 lg:pt-0">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-[#FFE600] mb-2">
                    Strategic Challenge
                  </h4>
                  <p className="text-sm sm:text-base text-black dark:text-slate-300 font-bold leading-relaxed">
                    {activeStudy.challenge}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-[#FFE600] mb-2">
                    Execution Strategy
                  </h4>
                  {activeStudy.summary && (
                    <p className="text-sm sm:text-base text-black dark:text-slate-300 font-bold leading-relaxed mb-4">
                      {activeStudy.summary}
                    </p>
                  )}
                  <div className="space-y-2">
                    {activeStudy.strategy && activeStudy.strategy.map((pillar) => (
                      <div key={pillar} className="flex items-center gap-2 text-xs sm:text-sm text-black dark:text-slate-200 font-extrabold">
                        <CheckCircle className="w-4 h-4 text-black dark:text-[#FFE600] shrink-0" />
                        <span>{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Executive Quote */}
                {activeStudy.quote && (
                  <div className="p-5 rounded-lg bg-[#FFE600] border-2 border-black text-black space-y-2 shadow-[3px_3px_0px_#000000]">
                    <div className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-wider">
                      <Quote className="w-4 h-4" /> Client Executive Testimonial
                    </div>
                    <p className="text-xs sm:text-sm font-bold italic leading-relaxed text-black">
                      "{activeStudy.quote.text}"
                    </p>
                    <div className="text-xs font-black text-black pt-1">
                      — {activeStudy.quote.author}, <span className="underline">{activeStudy.quote.role} ({activeStudy.quote.company})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
