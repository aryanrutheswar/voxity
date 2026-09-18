'use client';

import React from 'react';
import { Mail, Phone, Clock } from 'lucide-react';

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

export function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-white dark:bg-[#0B0F19] text-black dark:text-white border-t-2 border-black dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-black dark:text-[#FFE600] mb-3 block">
            Reach Out Directly
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-black dark:text-white tracking-tight">
            Contact Details
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-800 dark:text-slate-300 font-medium">
            Connect directly with our agency team via email, mobile, or Instagram for immediate assistance & project audits.
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Card 1: Direct Email */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black dark:text-[#FFE600] block mb-1">Direct Email</span>
              <a
                href="mailto:voxity.ity7@gmail.com"
                className="text-base sm:text-lg font-black text-black dark:text-white underline hover:text-indigo-600 dark:hover:text-[#FFE600] transition-colors break-all"
              >
                voxity.ity7@gmail.com
              </a>
            </div>
            <p className="text-xs text-black dark:text-slate-200 font-bold">
              Send your project briefs or inquiries directly to our growth directors.
            </p>
          </div>

          {/* Card 2: Mobile / Phone Support */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black dark:text-[#FFE600] block mb-1">WhatsApp & Phone Support</span>
              <div className="flex flex-wrap gap-2 text-base sm:text-lg font-black text-black dark:text-white font-mono pt-0.5">
                <a
                  href="https://wa.me/917569190243?text=Hi%20Voxity%2C%20I%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-[#FFE600] transition-colors underline decoration-emerald-500 underline-offset-4"
                  title="Chat on WhatsApp"
                >
                  +91 7569190243
                </a>
                <span className="text-slate-400 font-normal">|</span>
                <a
                  href="https://wa.me/919573646002?text=Hi%20Voxity%2C%20I%20would%20like%20to%20discuss%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-[#FFE600] transition-colors underline decoration-emerald-500 underline-offset-4"
                  title="Chat on WhatsApp"
                >
                  +91 9573646002
                </a>
              </div>
            </div>
            <p className="text-xs text-black dark:text-slate-200 font-bold">
              Click any number above to chat directly with our team on WhatsApp for instant assistance.
            </p>
          </div>

          {/* Card 3: Instagram Handle */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black dark:text-[#FFE600] block mb-1">Instagram Handle</span>
              <a
                href="https://instagram.com/voxity.ity7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base sm:text-lg font-black text-black dark:text-white underline hover:text-indigo-600 dark:hover:text-[#FFE600] transition-colors font-mono"
              >
                voxity.ity7
              </a>
            </div>
            <p className="text-xs text-black dark:text-slate-200 font-bold">
              Follow our official agency handle or send us a direct message on IG.
            </p>
          </div>

          {/* Card 4: Response Window */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-black dark:border-slate-700 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000000]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-black dark:text-[#FFE600] block mb-1">Response Window</span>
              <p className="text-base sm:text-lg font-black text-black dark:text-white">
                Mon - Sat, 9:00 AM - 8:00 PM IST
              </p>
            </div>
            <p className="text-xs text-black dark:text-slate-200 font-bold">
              Prompt response guaranteed within 4 operational hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
