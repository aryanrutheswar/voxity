'use client';

import React from 'react';
import { ArrowUp, Mail, Phone } from 'lucide-react';
import { VoxLogo } from '../widgets/VoxLogo';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#090D16] border-t-2 border-black dark:border-slate-800 text-black dark:text-white text-xs sm:text-sm pt-12 pb-10 relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Brand & Description */}
          <div className="space-y-3 text-center md:text-left">
            <a href="#home" className="inline-block">
              <VoxLogo size="md" />
            </a>
            <p className="text-slate-800 dark:text-slate-300 text-xs font-bold leading-relaxed max-w-md">
              Architecting high-converting digital growth engines through performance paid ads, Next.js web applications, and autonomous AI workflows.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://instagram.com/voxity.ity7"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#FFE600] text-black border border-black hover:bg-black hover:text-[#FFE600] transition-colors flex items-center gap-1.5 font-black text-xs"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>voxity.ity7</span>
            </a>
            <a
              href="mailto:voxity.ity7@gmail.com"
              className="p-2 rounded-lg bg-[#FFE600] text-black border border-black hover:bg-black hover:text-[#FFE600] transition-colors"
              aria-label="Email"
              title="voxity.ity7@gmail.com"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/917569190243?text=Hi%20Voxity%2C%20I%20would%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#FFE600] text-black border border-black hover:bg-black hover:text-[#FFE600] transition-colors"
              aria-label="WhatsApp"
              title="Chat on WhatsApp (+91 7569190243)"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-black dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black text-black dark:text-slate-300">
          <span>© 2026 Vox.ity Agency. All rights reserved.</span>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black font-black uppercase hover:bg-slate-900 dark:hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#FFE600] dark:shadow-[2px_2px_0px_#FFFFFF]"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
