'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSubscribed(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-xl border-2 border-black dark:border-slate-700 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#FFE600] text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-lg bg-[#FFE600] text-black border-2 border-black flex items-center justify-center mb-4 shadow-xs">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="font-heading text-2xl sm:text-4xl font-black text-black dark:text-white">
            Get Our Weekly <span className="gradient-text">Growth Playbook</span>
          </h3>
          <p className="mt-3 text-xs sm:text-base text-black dark:text-slate-300 font-extrabold max-w-xl leading-relaxed">
            Join 14,000+ marketing leaders receiving our breakdown of AI algorithms, Meta ad creative hooks, and technical SEO updates every Tuesday.
          </p>

          {subscribed ? (
            <div className="mt-6 flex items-center gap-2 text-black font-black text-sm bg-[#FFE600] px-5 py-2.5 rounded-md border-2 border-black shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-5 h-5 text-black" /> You're on the list! Saved to Database.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your executive email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-black dark:focus:border-[#FFE600] font-extrabold"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto btn-gradient px-6 py-3.5 rounded-md text-xs font-black uppercase tracking-wider whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Subscribe Free</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
