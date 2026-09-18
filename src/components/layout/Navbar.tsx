'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, ArrowRight, User, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { VoxLogo } from '../widgets/VoxLogo';
import { ThemeToggle } from '../widgets/ThemeToggle';

interface NavbarProps {
  onOpenCalendly: () => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar({ onOpenCalendly }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFE600] dark:bg-slate-900 text-black dark:text-white border-b-2 border-black dark:border-slate-800 py-3 shadow-sm transition-colors duration-300">
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Vox Style Yellow Circle Logo matching user screenshot */}
          <a href="#home" className="shrink-0 -ml-1 sm:ml-0">
            <VoxLogo size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-extrabold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black'
                      : 'text-black dark:text-slate-200 hover:bg-black/10 dark:hover:bg-slate-800 dark:hover:text-[#FFE600]'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="px-3.5 py-1.5 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                >
                  {user.role === 'ADMIN' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FFE600] dark:text-black" />
                      <span>Admin Portal</span>
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5 text-[#FFE600] dark:text-black" />
                      <span>Client Portal</span>
                    </>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-md bg-black/10 dark:bg-slate-800 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-md bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={onOpenCalendly}
              className="px-4 py-2 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black text-xs font-black uppercase tracking-wider hover:bg-slate-900 dark:hover:bg-amber-300 transition-all flex items-center gap-1.5 border border-black dark:border-slate-950 cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF]"
            >
              <span>Book Call</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Navigation Toggle Button & Theme Switcher */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-black text-[#FFE600] dark:bg-slate-800 dark:text-[#FFE600] dark:border dark:border-slate-700"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#FFE600] dark:bg-slate-900 text-black dark:text-white border-t-2 border-black dark:border-slate-800 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-md text-sm font-extrabold uppercase text-black dark:text-slate-100 hover:bg-black hover:text-[#FFE600] dark:hover:bg-slate-800 dark:hover:text-[#FFE600] transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-black/20 dark:border-slate-800 space-y-2">
                {user ? (
                  <Link
                    href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-3 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black font-black uppercase text-center block text-xs tracking-wider"
                  >
                    {user.role === 'ADMIN' ? '👑 Admin Dashboard' : '👤 My Client Portal'}
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full px-4 py-2.5 rounded-md bg-white dark:bg-slate-800 text-black dark:text-white font-black uppercase text-center block text-xs tracking-wider border-2 border-black dark:border-slate-700 shadow-[2px_2px_0px_#000000]"
                  >
                    🔑 Sign In
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCalendly();
                  }}
                  className="w-full bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black py-3 rounded-md text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Book Free Strategy Call</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
