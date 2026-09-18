'use client';

import React from 'react';
import { Phone } from 'lucide-react';

export function ContactWidget() {
  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#contact';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Call Button */}
      <button
        onClick={handleScrollToContact}
        className="w-14 h-14 rounded-full bg-[#FFE600] text-black border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer group relative"
        aria-label="Scroll to Contact Details"
        title="Go to Contact Details"
      >
        <Phone className="w-7 h-7 text-black group-hover:rotate-12 transition-transform fill-current" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-black"></span>
        </span>
      </button>
    </div>
  );
}
