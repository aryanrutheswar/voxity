'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User, Mail, ArrowLeft, LogOut, CheckCircle2, Clock, Calendar, Plus, Send, Sparkles, FolderCheck, Volume2, FileText
} from 'lucide-react';
import { LeadInquiry, Booking } from '@/lib/db';
import { VoxLogo } from '@/components/widgets/VoxLogo';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';

export default function ClientDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [myLeads, setMyLeads] = useState<LeadInquiry[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick inquiry form
  const [newService, setNewService] = useState('Search Engine Optimization (SEO)');
  const [dashSliderBudget, setDashSliderBudget] = useState(250000);
  const [newBudget, setNewBudget] = useState('₹2.5 Lakhs/mo');

  const formatDashBudgetLabel = (amount: number) => {
    if (amount < 100000) return `₹${amount.toLocaleString('en-IN')}/mo`;
    const lakhs = (amount / 100000).toFixed(1).replace('.0', '');
    return `₹${lakhs} Lakh${Number(lakhs) > 1 ? 's' : ''}/mo (₹${amount.toLocaleString('en-IN')})`;
  };

  const [newMessage, setNewMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMyData();
  }, [user]);

  const fetchMyData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && user && data.data) {
        const userEmail = user.email.toLowerCase();
        setMyLeads((data.data.leads || []).filter((l: LeadInquiry) => l.email.toLowerCase() === userEmail));
        setMyBookings((data.data.bookings || []).filter((b: Booking) => b.email.toLowerCase() === userEmail));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          company: 'Client Portal User',
          service: newService,
          budget: newBudget,
          message: newMessage
        })
      });
      setSubmitted(true);
      setNewMessage('');
      fetchMyData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20 transition-colors duration-300">
      {/* Top Header */}
      <header className="bg-[#FFE600] dark:bg-slate-900 text-black dark:text-white border-b-2 border-black dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 py-2.5">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="p-2.5 rounded-lg bg-black text-[#FFE600] dark:bg-slate-800 dark:text-[#FFE600] border-2 border-black dark:border-slate-700 hover:scale-105 transition-all cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600] shrink-0" title="Return to Website">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 pl-4 border-l-2 border-black/20 dark:border-slate-700/50">
              <VoxLogo size="sm" />
              <span className="font-extrabold text-xl text-black dark:text-white uppercase tracking-wide">
                Client Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/10 dark:bg-amber-500/10 border border-black/20 dark:border-amber-500/20 text-black dark:text-amber-400 text-xs font-bold">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </span>
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-4 py-2 rounded-md bg-black text-[#FFE600] dark:bg-slate-800 dark:text-white border border-black dark:border-slate-700 hover:bg-rose-600 dark:hover:bg-rose-600 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000000]"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-950 to-yellow-950/80 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Client Growth Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Welcome Back, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
              Track your submitted marketing briefs, campaign proposals, and strategy call schedules in real time.
            </p>
          </div>

          <a
            href="#new-brief"
            className="btn-gradient px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Request New Campaign Brief
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: My Submitted Inquiries & Strategy Sessions */}
          <div className="lg:col-span-7 space-y-8">
            {/* My Submitted Project Inquiries */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <FolderCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">My Submitted Project Briefs</h2>
              </div>

              {myLeads.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                  No project briefs submitted yet under <span className="text-white font-semibold">{user.email}</span>.
                </div>
              ) : (
                <div className="space-y-4">
                  {myLeads.map((lead) => (
                    <div key={lead.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{lead.service}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          lead.status === 'New'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : lead.status === 'Contacted'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : lead.status === 'Won'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          Status: {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{lead.message || 'No additional notes provided.'}</p>
                      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-800">
                        <span>Budget: <strong className="text-emerald-400">{lead.budget}</strong></span>
                        <span>Submitted: {new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Strategy Call Bookings */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">My Strategy Call Sessions</h2>
              </div>

              {myBookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-2xl">
                  No strategy sessions scheduled under <span className="text-white font-semibold">{user.email}</span>.
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map((book) => (
                    <div key={book.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-cyan-400 block">📅 {book.slot}</span>
                          <span className="text-[11px] text-slate-400">Google Meet Strategy Session {book.phone ? `• ${book.phone}` : ''}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          {book.status}
                        </span>
                      </div>
                      {book.notes && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                          <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 mb-1">
                            <FileText className="w-3.5 h-3.5" /> Requirement Note:
                          </span>
                          <p className="italic">{book.notes}</p>
                        </div>
                      )}
                      {book.audioNote && (
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Recorded Voice Note Attached
                          </span>
                          <audio controls src={book.audioNote} className="w-full h-8 accent-cyan-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Submit New Brief directly from Client Portal */}
          <div className="lg:col-span-5" id="new-brief">
            <div className="glass-card p-8 rounded-3xl border border-indigo-500/30">
              <h3 className="text-xl font-bold text-white mb-2">Request New Campaign Quote</h3>
              <p className="text-xs text-slate-400 mb-6">
                Submit a new marketing requirement directly into our Senior Growth Director database.
              </p>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Brief Added to Database!</h4>
                  <p className="text-xs text-slate-400">Our strategists will review your request shortly.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    Submit Another Brief
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Primary Service</label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Search Engine Optimization (SEO)">Search Engine Optimization (SEO)</option>
                      <option value="Google Ads (PPC)">Google Ads (PPC)</option>
                      <option value="Meta Ads Scale">Meta Ads & Paid Social</option>
                      <option value="Social Media Marketing">Social Media Marketing</option>
                      <option value="Brand Identity">Brand Identity & Strategy</option>
                      <option value="Website Development">Web Development (Next.js)</option>
                      <option value="AI Automation">AI Workflows & Automation</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase text-slate-400">
                        Estimated Budget (₹5k to ₹10 Lakhs)
                      </label>
                      <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                        {formatDashBudgetLabel(dashSliderBudget)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="1000000"
                      step="5000"
                      value={dashSliderBudget}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDashSliderBudget(val);
                        setNewBudget(formatDashBudgetLabel(val));
                      }}
                      className="w-full h-2 rounded-lg bg-slate-900 appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-1">
                      <span>₹5k</span>
                      <span>₹2.5L</span>
                      <span>₹5.0L</span>
                      <span>₹7.5L</span>
                      <span>₹10.0L+</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1.5">Project Goals & Brief Details</label>
                    <textarea
                      rows={4}
                      placeholder="Outline target goals, timeline, or CAC expectations..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-gradient py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" /> Submit Brief to Strategists
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
