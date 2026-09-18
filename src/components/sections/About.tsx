'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../../data/mockData';
import { Target, Zap, Shield, Cpu, Globe, Share2, Sparkles, CheckCircle2 } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: 'Data-First Precision',
    description: 'We ignore vanity metrics. Every campaign decision is backed by unit economics, pipeline attribution, and verified revenue.'
  },
  {
    icon: Zap,
    title: 'Relentless Velocity',
    description: 'Marketing moves fast. We launch, test, and optimize creative variations in days, keeping you ahead of market shifts.'
  },
  {
    icon: Cpu,
    title: 'AI Automation Core',
    description: 'We embed autonomous AI workflows into your growth funnels to scale efficiency and reduce human error.'
  },
  {
    icon: Shield,
    title: 'Radical Transparency',
    description: 'Direct Slack communication, real-time Looker Studio dashboards, and complete ownership of your ad accounts.'
  }
];

const TIMELINE = [
  { year: '2021', title: 'Agency Inception', desc: 'Founded by senior growth leads & digital architects.' },
  { year: '2023', title: '₹400 Cr Client Milestone', desc: 'Surpassed ₹400 Cr in verified revenue generated for clients.' },
  { year: '2025', title: 'AI Workflows Integration', desc: 'Launched proprietary autonomous AI marketing workflows.' },
  { year: '2026', title: 'Global Scale', desc: 'Managing ₹300 Cr+ annual ad spend for enterprise clients.' }
];

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Who We Are
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            We Are Not Just An Agency. <br />
            We Are Growth Engineers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-black dark:text-slate-200 font-extrabold leading-relaxed">
            Founded by veteran growth leaders and UI engineers, Aetheris Digital bridges the gap between creative storytelling, modern web tech, and AI automation.
          </p>
        </div>

        {/* Agency Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-xl border-2 border-black dark:border-slate-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600] relative"
          >
            <div className="inline-flex p-3 rounded-lg bg-[#FFE600] text-black border border-black mb-6 shadow-xs">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-black dark:text-white mb-4">
              Our Uncompromising Mission
            </h3>
            <p className="text-base text-black dark:text-slate-300 font-bold leading-relaxed mb-6">
              In an era dominated by noise and generic templates, we empower category-defining brands to establish undisputed digital authority. We believe marketing should be an investable profit center, not a speculative expense.
            </p>
            <ul className="space-y-3">
              {[
                'Full transparency with zero hidden markups',
                'Custom tailored strategy, no cookie-cutter playbooks',
                'Enterprise-grade Next.js development & design standards',
                'Dedicated pod of senior growth specialists'
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm sm:text-base font-extrabold text-black dark:text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-black dark:text-[#FFE600] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Interactive Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="font-heading text-2xl sm:text-3xl font-black text-black dark:text-white mb-6 flex items-center gap-2">
              <span>Our Track Record of Momentum</span>
            </h3>
            <div className="space-y-4">
              {TIMELINE.map((item) => (
                <div
                  key={item.year}
                  className="bg-white dark:bg-slate-900 p-5 rounded-xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] flex items-start gap-4 hover:shadow-[6px_6px_0px_#000000] dark:hover:shadow-[6px_6px_0px_#FFE600] transition-all"
                >
                  <span className="px-3.5 py-1.5 rounded-md bg-[#FFE600] border border-black text-black font-black text-xs uppercase shrink-0">
                    {item.year}
                  </span>
                  <div>
                    <h4 className="text-base font-black text-black dark:text-white">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-black dark:text-slate-300 font-bold mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-24">
          <h3 className="font-heading text-2xl sm:text-3xl font-black text-center text-black dark:text-white mb-12">
            The Principles That Drive Our Execution
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 p-6 rounded-xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-lg bg-[#FFE600] border-2 border-black text-black flex items-center justify-center mb-6 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-black dark:text-white mb-2">{val.title}</h4>
                    <p className="text-xs sm:text-sm text-black dark:text-slate-300 font-bold leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team Showcase */}
        <div>
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl font-black text-black dark:text-white">
              Meet The Growth Strategists
            </h3>
            <p className="text-sm sm:text-base text-black dark:text-slate-300 font-extrabold mt-2">
              Senior leaders directly managing your growth campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600]"
              >
                <div className="h-56 overflow-hidden relative border-b-2 border-black dark:border-slate-700">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-[#FFE600] border border-black text-black text-[10px] font-black uppercase tracking-wider">
                    {member.specialty}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-black text-black dark:text-white">{member.name}</h4>
                  <p className="text-xs text-black dark:text-[#FFE600] font-extrabold uppercase mb-2">{member.role}</p>
                  <p className="text-xs text-black dark:text-slate-300 font-bold mb-4 line-clamp-2">
                    {member.bio}
                  </p>
                  <div className="flex items-center gap-3 text-black dark:text-slate-200">
                    <a href={member.linkedin} className="hover:opacity-75 transition-opacity">
                      <Globe className="w-4 h-4" />
                    </a>
                    <a href={member.twitter} className="hover:opacity-75 transition-opacity">
                      <Share2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
