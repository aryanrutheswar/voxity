'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Lock, Mail, Key, Sparkles, LogOut, RefreshCw, Download, Trash2, CheckCircle2, AlertCircle, ArrowLeft, Users, Calendar, Inbox, DollarSign, Plus, Edit3, X, BookOpen, Layers, Mic, Volume2, FileText, CheckSquare, Upload, ExternalLink, Eye, Clock, FileCheck, AlertTriangle, Share2, Copy, Send
} from 'lucide-react';
import { LeadInquiry, Booking, Subscriber, WorkTask } from '@/lib/db';
import { Service, BlogPost } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { VoxLogo } from '@/components/widgets/VoxLogo';
import { ThemeToggle } from '@/components/widgets/ThemeToggle';

export default function AdminPortal() {
  const { user, loginWithGoogle, logout: authLogout } = useAuth();
  const [email, setEmail] = useState('aryanrutheswar1823@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'REQUEST_OTP' | 'VERIFY_OTP' | 'DASHBOARD'>('REQUEST_OTP');

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      setEmail(user.email);
      setStep('DASHBOARD');
    }
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const handleGoogleAdminLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      const { user: authUser } = await loginWithGoogle();
      if (authUser.role !== 'ADMIN') {
        setErrorMsg(`Access Denied: ${authUser.email} is not authorized for Super Admin access.`);
        return;
      }
      setEmail(authUser.email);
      setStep('DASHBOARD');
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google Admin Authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const [dbData, setDbData] = useState<{
    leads: LeadInquiry[];
    bookings: Booking[];
    subscribers: Subscriber[];
    services: Service[];
    blogPosts: BlogPost[];
    workTasks: WorkTask[];
    stats: {
      totalLeads: number;
      totalBookings: number;
      totalSubscribers: number;
      totalServices: number;
      totalBlogPosts: number;
      newLeadsCount: number;
      estimatedPipelineValue: number;
      pendingWorksCount: number;
      completedWorksCount: number;
    };
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'pendingWorks' | 'completedWorks' | 'bookings'>('pendingWorks');

  // Modal & Form States for Pending Works CMS
  const [isPendingWorkModalOpen, setIsPendingWorkModalOpen] = useState(false);
  const [pendingWorkForm, setPendingWorkForm] = useState<Omit<WorkTask, 'id' | 'status' | 'createdAt'>>({
    title: '',
    clientName: '',
    serviceCategory: 'Growth Strategy',
    description: '',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    priority: 'High'
  });

  // Modal & Form States for Proof Upload & Verification
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [selectedTaskForProof, setSelectedTaskForProof] = useState<WorkTask | null>(null);
  const [proofForm, setProofForm] = useState<{
    proofType: 'Screenshot/Image' | 'Live Link' | 'Document/File';
    proofDataOrUrl: string;
    notes: string;
  }>({
    proofType: 'Screenshot/Image',
    proofDataOrUrl: '',
    notes: '',
  });

  // Modal & Form States for Sharing Pending Work Tasks
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedTaskForShare, setSelectedTaskForShare] = useState<WorkTask | null>(null);
  const [copiedToast, setCopiedToast] = useState('');

  const openShareTaskModal = (task: WorkTask) => {
    setSelectedTaskForShare(task);
    setIsShareModalOpen(true);
    setCopiedToast('');
  };

  const getTaskShareText = (task: WorkTask) => {
    return `📌 *Task:* ${task.title}\n👤 *Client:* ${task.clientName}\n🏷️ *Category:* ${task.serviceCategory}\n📅 *Due Date:* ${task.dueDate}\n🚨 *Priority:* ${task.priority}\n📝 *Details:* ${task.description}\n\nShared via Vox.ity Agency Platform`;
  };

  const handleCopyTaskText = (task: WorkTask) => {
    const text = getTaskShareText(task);
    navigator.clipboard.writeText(text);
    setCopiedToast('Task details copied to clipboard!');
    setTimeout(() => setCopiedToast(''), 3000);
  };

  const handleCopyTaskLink = (task: WorkTask) => {
    const link = `${window.location.origin}/#services?taskId=${task.id}`;
    navigator.clipboard.writeText(link);
    setCopiedToast('Shareable link copied to clipboard!');
    setTimeout(() => setCopiedToast(''), 3000);
  };

  const handleWhatsAppShare = (task: WorkTask) => {
    const text = getTaskShareText(task);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleEmailShare = (task: WorkTask) => {
    const text = getTaskShareText(task);
    const mailto = `mailto:?subject=${encodeURIComponent(`[Task Share] ${task.title}`)}&body=${encodeURIComponent(text)}`;
    window.open(mailto, '_blank');
  };

  const handleNativeWebShare = async (task: WorkTask) => {
    const text = getTaskShareText(task);
    if (navigator.share) {
      try {
        await navigator.share({
          title: task.title,
          text: text,
          url: `${window.location.origin}/#services`
        });
      } catch (err) {
        console.log('Share canceled', err);
      }
    } else {
      handleCopyTaskText(task);
    }
  };



  const openVerifyProofModal = (task: WorkTask) => {
    setSelectedTaskForProof(task);
    setProofForm({
      proofType: task.proof?.proofType || 'Live Link',
      proofDataOrUrl: task.proof?.proofDataOrUrl || '',
      notes: task.proof?.notes || ''
    });
    setIsProofModalOpen(true);
  };

  const handleSaveProofAndComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForProof) return;

    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateWorkTask',
          id: selectedTaskForProof.id,
          updates: {
            status: 'Completed',
            proof: {
              uploadedAt: new Date().toISOString(),
              proofType: proofForm.proofType,
              proofDataOrUrl: proofForm.proofDataOrUrl,
              notes: proofForm.notes,
              verifiedByAdmin: true,
              verifiedAt: new Date().toISOString()
            }
          }
        })
      });
      setIsProofModalOpen(false);
      setSelectedTaskForProof(null);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReopenTask = async (id: string) => {
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateWorkTask',
          id,
          updates: { status: 'Pending' }
        })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllPendingWorks = async () => {
    if (!window.confirm('Are you sure you want to delete all pending works?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearWorkTasks' })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };



  // Modal & Form States for Services CMS
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'id'>>({
    title: '',
    category: 'Growth',
    shortDesc: '',
    fullDesc: '',
    iconName: 'Sparkles',
    features: ['Feature 1', 'Feature 2'],
    deliverables: ['Deliverable 1'],
    expectedROI: '+200% ROI'
  });

  // Modal & Form States for Blog CMS
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Omit<BlogPost, 'id' | 'publishedAt'>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'AI Marketing',
    readTime: '5 min read',
    author: { name: 'Super Admin', role: 'Senior Growth Director', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
    tags: ['AI', 'Growth', 'Strategy']
  });

  // Modal & Form States for Admin Lead Budget Adjuster (₹5k to ₹10L)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [selectedLeadForBudget, setSelectedLeadForBudget] = useState<LeadInquiry | null>(null);
  const [adminBudgetSlider, setAdminBudgetSlider] = useState<number>(250000);

  const openAdjustBudgetModal = (lead: LeadInquiry) => {
    setSelectedLeadForBudget(lead);
    setAdminBudgetSlider(250000);
    setIsBudgetModalOpen(true);
  };

  const handleSaveLeadBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForBudget) return;
    const lakhs = (adminBudgetSlider / 100000).toFixed(1).replace('.0', '');
    const formattedBudget = adminBudgetSlider < 100000
      ? `₹${adminBudgetSlider.toLocaleString('en-IN')}/mo`
      : `₹${lakhs} Lakh${Number(lakhs) > 1 ? 's' : ''}/mo (₹${adminBudgetSlider.toLocaleString('en-IN')})`;

    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateLeadBudget', id: selectedLeadForBudget.id, budget: formattedBudget })
      });
      setIsBudgetModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Request 6-digit OTP code
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to request verification code');
        setLoading(false);
        return;
      }

      setSuccessMsg(data.message);
      setStep('VERIFY_OTP');
    } catch (err) {
      setErrorMsg('Network error connecting to backend API');
    } finally {
      setLoading(false);
    }
  };

  // Verify 6-digit OTP code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid verification code');
        setLoading(false);
        return;
      }

      setStep('DASHBOARD');
      fetchDashboardData();
    } catch (err) {
      setErrorMsg('Network error during verification');
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time database records
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setDbData(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    }
  };

  // Update lead status
  const handleUpdateStatus = async (id: string, newStatus: LeadInquiry['status']) => {
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateStatus', id, status: newStatus })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead from the database?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteLead', id })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Bookings Actions ---
  const handleUpdateBookingStatus = async (id: string, newStatus: Booking['status']) => {
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateBookingStatus', id, status: newStatus })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this strategy session booking?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteBooking', id })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Pending Works & Proof Verification Actions ---
  const handleSavePendingWork = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addPendingWork', payload: pendingWorkForm })
      });
      setIsPendingWorkModalOpen(false);
      setPendingWorkForm({
        title: '',
        clientName: '',
        serviceCategory: 'Growth Strategy',
        description: '',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        priority: 'High'
      });
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to add pending work', err);
    }
  };



  const handleDeleteWorkTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work task item?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteWorkTask', id })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CMS Service Actions ---
  const openNewServiceModal = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      category: 'Growth',
      shortDesc: '',
      fullDesc: '',
      iconName: 'Sparkles',
      features: ['Custom Feature 1', 'Custom Feature 2'],
      deliverables: ['Custom Deliverable 1'],
      expectedROI: '+200% ROI Scaling'
    });
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (s: Service) => {
    setEditingService(s);
    setServiceForm({
      title: s.title,
      category: s.category,
      shortDesc: s.shortDesc,
      fullDesc: s.fullDesc,
      iconName: s.iconName || 'Sparkles',
      features: s.features || [],
      deliverables: s.deliverables || [],
      expectedROI: s.expectedROI || '+200% ROI',
      badge: s.badge
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = editingService ? 'editService' : 'addService';
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: editingService?.id, payload: serviceForm })
      });
      setIsServiceModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save service', err);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service from the website?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteService', id })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- CMS Blog Actions ---
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'AI Marketing',
      readTime: '4 min read',
      author: { name: 'Senior Strategist', role: 'Growth Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000',
      tags: ['AI', 'SEO', 'Paid Ads']
    });
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (b: BlogPost) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      category: b.category,
      readTime: b.readTime,
      author: b.author,
      image: b.image,
      tags: b.tags
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const action = editingBlog ? 'editBlogPost' : 'addBlogPost';
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id: editingBlog?.id, payload: blogForm })
      });
      setIsBlogModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to save blog post', err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post from the website?')) return;
    try {
      await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteBlogPost', id })
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // Export CSV & JSON Data Reports
  const downloadCsvFile = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const escapeCell = (cell: string | number) => {
      if (cell === null || cell === undefined) return '""';
      const str = String(cell).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvContent =
      headers.map(escapeCell).join(',') +
      '\n' +
      rows.map(row => row.map(escapeCell).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportLeadsCsv = () => {
    if (!dbData?.leads) return;
    const headers = ['ID', 'Client Name', 'Email Address', 'Company', 'Requested Service', 'Budget', 'Status', 'Submitted Date'];
    const rows = dbData.leads.map(l => [
      l.id,
      l.name,
      l.email,
      l.company,
      l.service,
      l.budget,
      l.status,
      new Date(l.createdAt).toLocaleString()
    ]);
    downloadCsvFile(`lead_inquiries_${Date.now()}.csv`, headers, rows);
  };

  const handleExportBookingsCsv = () => {
    if (!dbData?.bookings) return;
    const headers = ['ID', 'Customer Name', 'Email Address', 'Phone Number', 'Requested Slot', 'Typed Notes / Requirements', 'Voice Note Attached', 'Status', 'Booked Date'];
    const rows = dbData.bookings.map(b => [
      b.id,
      b.name,
      b.email,
      b.phone || 'N/A',
      b.slot,
      b.notes || 'None',
      b.audioNote ? 'Yes (Voice Recording Included)' : 'No',
      b.status,
      new Date(b.createdAt).toLocaleString()
    ]);
    downloadCsvFile(`strategy_call_bookings_${Date.now()}.csv`, headers, rows);
  };

  const handleExportTasksCsv = () => {
    if (!dbData?.workTasks) return;
    const headers = ['ID', 'Task Title', 'Client Name', 'Service Category', 'Priority', 'Due Date', 'Status', 'Description', 'Proof Notes', 'Verified Date'];
    const rows = dbData.workTasks.map(t => [
      t.id,
      t.title,
      t.clientName,
      t.serviceCategory,
      t.priority,
      t.dueDate,
      t.status,
      t.description,
      t.proof?.notes || 'N/A',
      t.proof?.verifiedAt ? new Date(t.proof.verifiedAt).toLocaleString() : 'N/A'
    ]);
    downloadCsvFile(`work_tasks_report_${Date.now()}.csv`, headers, rows);
  };

  const handleExportAllCsvSummary = () => {
    if (!dbData) return;
    handleExportLeadsCsv();
    setTimeout(() => handleExportBookingsCsv(), 400);
    setTimeout(() => handleExportTasksCsv(), 800);
  };

  const handleExportJson = () => {
    if (!dbData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `voxity_database_full_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20 transition-colors duration-300">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#FFE600] dark:bg-slate-900 text-black dark:text-white border-b-2 border-black dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300 py-2.5">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="p-2.5 rounded-lg bg-black text-[#FFE600] dark:bg-slate-800 dark:text-[#FFE600] border-2 border-black dark:border-slate-700 hover:scale-105 transition-all cursor-pointer shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFE600] shrink-0" title="Return to Website">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 sm:gap-6 pl-4 border-l-2 border-black/20 dark:border-slate-700/50">
              <VoxLogo size="sm" />
              <span className="font-extrabold text-xl text-black dark:text-white uppercase tracking-wide">
                Admin Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {step === 'DASHBOARD' && (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black/10 dark:bg-emerald-500/10 border border-black/20 dark:border-emerald-500/20 text-black dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {email}
                </span>
                <button
                  onClick={() => {
                    authLogout();
                    setStep('REQUEST_OTP');
                  }}
                  className="px-4 py-2 rounded-md bg-black text-[#FFE600] dark:bg-slate-800 dark:text-white border border-black dark:border-slate-700 hover:bg-rose-600 dark:hover:bg-rose-600 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000000]"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Step 1 & 2: Admin Security Verification Screens */}
        {step !== 'DASHBOARD' && (
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <h1 className="text-3xl font-extrabold text-white">Administrator Portal</h1>
              <p className="text-sm text-slate-400">
                Restricted super admin portal for <span className="text-indigo-400 font-semibold">{email}</span>.
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Request OTP Screen */}
            {step === 'REQUEST_OTP' && (
              <div className="glass-card p-8 rounded-3xl space-y-6 border border-slate-800">
                <button
                  type="button"
                  onClick={handleGoogleAdminLogin}
                  disabled={googleLoading || loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all border border-slate-200 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  {googleLoading ? 'Authenticating Admin with Google...' : 'Super Admin Sign In with Google'}
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase absolute">
                    Or Admin Email Verification
                  </span>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                      Admin Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="aryanrutheswar1823@gmail.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full btn-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {loading ? 'Generating Code...' : 'Send Single-Use Verification Code'}
                  </button>
                </form>
              </div>
            )}

            {/* Verify OTP Screen */}
            {step === 'VERIFY_OTP' && (
              <div className="space-y-6">
                <form onSubmit={handleVerifyOtp} className="glass-card p-8 rounded-3xl space-y-6 border border-indigo-500/30">
                  <div className="text-center space-y-1">
                    <span className="text-xs text-indigo-400 font-bold uppercase">Step 2 of 2</span>
                    <h3 className="text-xl font-bold text-white">Enter 6-Digit Security Code</h3>
                    <p className="text-xs text-slate-400">
                      Code sent to your email <span className="text-white font-semibold">{email}</span>. Code expires in <span className="text-amber-400 font-bold">3 minutes</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-2 text-center">
                      6-Digit Security Code
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="e.g. 748192"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otpCode.length < 6}
                    className="w-full btn-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Verify Code & Launch Admin Dashboard'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setStep('REQUEST_OTP')}
                      className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      ← Request New Verification Code
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Admin CMS Control Center */}
        {step === 'DASHBOARD' && dbData && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/80 via-slate-950 to-yellow-950/80 border border-amber-500/30">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  Super Admin Management Portal
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={fetchDashboardData}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-2 border border-slate-700 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-amber-400" /> Refresh Data
                </button>
                <button
                  onClick={handleExportAllCsvSummary}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer border border-emerald-500"
                >
                  <FileText className="w-4 h-4" /> Download CSV Reports
                </button>
                <button
                  onClick={handleExportJson}
                  className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Backup DB (JSON)
                </button>
              </div>
            </div>



            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-slate-300 dark:border-slate-800 pb-4 overflow-x-auto">

              <button
                onClick={() => setActiveTab('pendingWorks')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${activeTab === 'pendingWorks'
                  ? 'bg-[#FFE600] border-2 border-black text-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-300 hover:border-black dark:hover:border-slate-600'
                  }`}
              >
                ⏳ Pending Works ({dbData.workTasks ? dbData.workTasks.filter(w => w.status !== 'Completed').length : 0})
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${activeTab === 'bookings'
                  ? 'bg-[#FFE600] border-2 border-black text-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-300 hover:border-black dark:hover:border-slate-600'
                  }`}
              >
                📞 Booked Calls ({dbData.bookings ? dbData.bookings.length : 0})
              </button>

              <button
                onClick={() => setActiveTab('completedWorks')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${activeTab === 'completedWorks'
                  ? 'bg-[#FFE600] border-2 border-black text-black shadow-[3px_3px_0px_#000000]'
                  : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-300 hover:border-black dark:hover:border-slate-600'
                  }`}
              >
                ✅ Works Done ({dbData.workTasks ? dbData.workTasks.filter(w => w.status === 'Completed').length : 0})
              </button>
            </div>



            {/* Tab: Pending Works (Future Deliverables) */}
            {activeTab === 'pendingWorks' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> Pending Future Works ({dbData.workTasks ? dbData.workTasks.filter(w => w.status !== 'Completed').length : 0})
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      onClick={handleClearAllPendingWorks}
                      className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer border border-rose-500"
                      title="Clear all pending works"
                    >
                      <Trash2 className="w-4 h-4" /> Clear All Pending Works
                    </button>
                    <button
                      onClick={handleExportTasksCsv}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer border border-emerald-500"
                    >
                      <Download className="w-4 h-4" /> Download Tasks CSV
                    </button>
                  </div>
                </div>

                {(!dbData.workTasks || dbData.workTasks.filter(w => w.status !== 'Completed').length === 0) ? (
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-700 dark:text-slate-400 text-xs font-bold border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000]">
                    No pending works found. Client strategy calls and campaign briefs automatically appear here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dbData.workTasks.filter(w => w.status !== 'Completed').map((task) => (
                      <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 relative flex flex-col justify-between transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${task.priority === 'High'
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                              : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                              }`}>
                              {task.priority} Priority
                            </span>
                            <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                              📅 Due: {task.dueDate}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-black dark:text-white">{task.title}</h4>
                          <div className="text-xs text-indigo-700 dark:text-indigo-400 font-bold">Client: {task.clientName} ({task.serviceCategory})</div>
                          <p className="text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-medium">{task.description}</p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => openVerifyProofModal(task)}
                            className="btn-gradient flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <FileCheck className="w-4 h-4" /> Upload Proof & Verify
                          </button>
                          <button
                            onClick={() => openShareTaskModal(task)}
                            className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer border border-indigo-500/20 flex items-center gap-1.5 text-xs font-black"
                            title="Share Task with Friends/Team"
                          >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                          <button
                            onClick={() => handleDeleteWorkTask(task.id)}
                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Strategy Call Bookings */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" /> Strategy Call Bookings ({dbData.bookings ? dbData.bookings.length : 0})
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-slate-400 font-bold">All 30-min strategy audit calls booked by clients via website.</p>
                </div>

                {(!dbData.bookings || dbData.bookings.length === 0) ? (
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-700 dark:text-slate-400 text-xs font-bold border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000]">
                    No strategy call bookings found yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dbData.bookings.map((book) => (
                      <div key={book.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] space-y-4 relative flex flex-col justify-between transition-all">
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              {book.status}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400">
                              {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-black dark:text-white">{book.name}</h4>
                          <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex flex-wrap items-center gap-2">
                            <span>📧 {book.email}</span>
                            {book.phone && <span>📞 {book.phone}</span>}
                          </div>
                          <div className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            ⏰ Requested Slot: {book.slot}
                          </div>
                          {book.notes && (
                            <p className="text-xs text-slate-900 dark:text-slate-200 leading-relaxed font-medium bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                              📝 Notes: {book.notes}
                            </p>
                          )}

                          {book.audioNote && (
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4 text-emerald-400" /> Client Voice Note Recorded
                              </span>
                              <audio controls src={book.audioNote} className="w-full h-8 accent-cyan-400" />
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?phone=${book.phone ? encodeURIComponent(book.phone) : ''}&text=${encodeURIComponent(`Hi ${book.name}, confirming your Strategy Audit call scheduled for ${book.slot}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-gradient flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <Send className="w-4 h-4" /> WhatsApp Client
                          </a>
                          <button
                            onClick={() => handleDeleteBooking(book.id)}
                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer border border-rose-500/20"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Works Done (Verified Completed Works) */}
            {activeTab === 'completedWorks' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-black dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Completed Works Archive ({dbData.workTasks ? dbData.workTasks.filter(w => w.status === 'Completed').length : 0})
                  </h3>
                  <p className="text-xs text-slate-800 dark:text-slate-400 font-bold">All verified work completed with admin proof of work confirmation.</p>
                </div>

                {(!dbData.workTasks || dbData.workTasks.filter(w => w.status === 'Completed').length === 0) ? (
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-700 dark:text-slate-400 text-xs font-bold border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000]">
                    No completed works archived yet. Verify pending works to move them here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dbData.workTasks.filter(w => w.status === 'Completed').map((task) => (
                      <div key={task.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-emerald-500 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#10B981] space-y-4 relative flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black flex items-center gap-1.5 uppercase">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Admin
                            </span>
                            <span className="text-[10px] text-slate-700 dark:text-slate-400 font-mono font-bold">
                              Done: {task.proof?.verifiedAt ? new Date(task.proof.verifiedAt).toLocaleDateString() : 'Recently'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white">{task.title}</h4>
                          <div className="text-xs text-indigo-400 font-semibold">Client: {task.clientName} ({task.serviceCategory})</div>
                          <p className="text-xs text-slate-300">{task.description}</p>

                          {/* Proof of Work Details Card */}
                          {task.proof && (
                            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <FileCheck className="w-3.5 h-3.5" /> Proof Type: {task.proof.proofType}
                                </span>
                              </div>

                              <p className="text-xs text-slate-400 italic">"{task.proof.notes}"</p>

                              {task.proof.proofDataOrUrl.startsWith('data:image') ? (
                                <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 max-h-40">
                                  <img src={task.proof.proofDataOrUrl} alt="Proof of work" className="w-full h-full object-cover" />
                                </div>
                              ) : task.proof.proofDataOrUrl.startsWith('http') ? (
                                <a
                                  href={task.proof.proofDataOrUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs text-cyan-400 font-bold hover:underline pt-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" /> View Deliverable Proof Link
                                </a>
                              ) : (
                                <div className="text-xs text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 font-mono text-[11px]">
                                  {task.proof.proofDataOrUrl}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center gap-2">
                          <button
                            onClick={() => handleReopenTask(task.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Reopen Task to Pending Works"
                          >
                            <Clock className="w-3.5 h-3.5" /> Reopen to Pending
                          </button>
                          <button
                            onClick={() => handleDeleteWorkTask(task.id)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Archived Work"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-black dark:border-slate-800 shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#FFE600]">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Strategy Call Session Bookings</h3>
                    <p className="text-xs text-slate-700 dark:text-slate-400 font-bold">Total {dbData.bookings.length} strategy call bookings recorded in database</p>
                  </div>
                  <button
                    onClick={handleExportBookingsCsv}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-md cursor-pointer border border-emerald-500 shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download Bookings CSV
                  </button>
                </div>

                {dbData.bookings.length === 0 ? (
                  <div className="glass-card p-12 rounded-3xl text-center text-slate-400 text-xs border border-slate-800">
                    No strategy session call bookings found in the database.
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="block md:hidden space-y-4">
                      {dbData.bookings.map((booking) => (
                        <div key={booking.id} className="dark-glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-bold text-white">{booking.name}</h4>
                              <span className="text-xs text-indigo-400 font-mono block">{booking.email}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Delete Booking"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-xs text-slate-300 space-y-1.5 pt-1 border-t border-slate-800">
                            <div><strong className="text-slate-400">Scheduled Slot:</strong> <span className="text-amber-400 font-bold">📅 {booking.slot}</span></div>
                            {booking.phone && (
                              <div><strong className="text-slate-400">Mobile Phone:</strong> <span className="text-emerald-400 font-mono font-bold">{booking.phone}</span></div>
                            )}
                            <div><strong className="text-slate-400">Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</div>
                          </div>

                          {booking.notes && (
                            <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs text-slate-300">
                              <strong className="text-indigo-400 block mb-0.5 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5" /> Project Notes / Requirements:
                              </strong>
                              <p className="italic text-slate-200">{booking.notes}</p>
                            </div>
                          )}

                          {booking.audioNote ? (
                            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
                              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4" /> Customer Voice Message
                              </span>
                              <audio controls src={booking.audioNote} className="w-full h-8 accent-emerald-500" />
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-500 italic">No voice recording attached.</div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="text-xs text-slate-400">Status:</span>
                            <select
                              value={booking.status}
                              onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as Booking['status'])}
                              className={`px-3 py-1 rounded-full text-[11px] font-bold border focus:outline-none cursor-pointer ${booking.status === 'Confirmed'
                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                                : booking.status === 'Completed'
                                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                }`}
                            >
                              <option value="Confirmed" className="bg-slate-900 text-white">Confirmed</option>
                              <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                              <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-black dark:border-slate-800 shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#FFE600] transition-all">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-xs font-black text-black dark:text-slate-200 uppercase tracking-wider">
                              <th className="p-4">Customer Name</th>
                              <th className="p-4">Email Address</th>
                              <th className="p-4">Mobile Number</th>
                              <th className="p-4">Requested Slot</th>
                              <th className="p-4">Typed Requirements</th>
                              <th className="p-4">Recorded Voice Note</th>
                              <th className="p-4">Status</th>
                              <th className="p-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                            {dbData.bookings.map((booking) => (
                              <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                                <td className="p-4 font-black text-black dark:text-white">{booking.name}</td>
                                <td className="p-4 text-indigo-700 dark:text-indigo-400 font-mono font-bold">{booking.email}</td>
                                <td className="p-4 text-emerald-700 dark:text-emerald-400 font-mono font-bold">{booking.phone || 'N/A'}</td>
                                <td className="p-4 text-amber-700 dark:text-amber-400 font-black">📅 {booking.slot}</td>
                                <td className="p-4 max-w-[200px]">
                                  {booking.notes ? (
                                    <span className="text-black dark:text-slate-200 font-medium line-clamp-2" title={booking.notes}>
                                      {booking.notes}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500 text-[11px] italic font-medium">None</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  {booking.audioNote ? (
                                    <div className="flex items-center gap-2">
                                      <audio controls src={booking.audioNote} className="h-8 max-w-[220px] accent-indigo-500" />
                                    </div>
                                  ) : (
                                    <span className="text-slate-500 text-[11px] italic font-medium">No audio recorded</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <select
                                    value={booking.status}
                                    onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as Booking['status'])}
                                    className={`px-3 py-1 rounded-full text-[11px] font-black border focus:outline-none cursor-pointer ${booking.status === 'Confirmed'
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                                      : booking.status === 'Completed'
                                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400'
                                        : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                                      }`}
                                  >
                                    <option value="Confirmed" className="bg-white text-black dark:bg-slate-900 dark:text-white">Confirmed</option>
                                    <option value="Completed" className="bg-white text-black dark:bg-slate-900 dark:text-white">Completed</option>
                                    <option value="Cancelled" className="bg-white text-black dark:bg-slate-900 dark:text-white">Cancelled</option>
                                  </select>
                                </td>
                                <td className="p-4 text-right">
                                  <button
                                    onClick={() => handleDeleteBooking(booking.id)}
                                    className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                                    title="Delete Booking"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}


          </div>
        )}
      </main>

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-xl w-full border border-indigo-500/30 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingService ? 'Edit Service Details' : 'Add New Agency Service'}
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  placeholder="e.g. AI Workflow Automation"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Growth">Growth</option>
                    <option value="Creative">Creative</option>
                    <option value="Technology">Technology</option>
                    <option value="AI">AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expected ROI</label>
                  <input
                    type="text"
                    value={serviceForm.expectedROI}
                    onChange={(e) => setServiceForm({ ...serviceForm, expectedROI: e.target.value })}
                    placeholder="+250% Growth"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Short Summary *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.shortDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, shortDesc: e.target.value })}
                  placeholder="Brief 1-sentence summary..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={serviceForm.fullDesc}
                  onChange={(e) => setServiceForm({ ...serviceForm, fullDesc: e.target.value })}
                  placeholder="Detailed breakdown..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  Save & Publish Live
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-xl w-full border border-cyan-500/30 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white">
                {editingBlog ? 'Edit Blog Article' : 'Publish New Blog Article'}
              </h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. Navigating AI SEO Algorithms in 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="SEO">SEO</option>
                    <option value="AI Marketing">AI Marketing</option>
                    <option value="Paid Ads">Paid Ads</option>
                    <option value="CRO">CRO</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estimated Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Article Excerpt *</label>
                <textarea
                  rows={3}
                  required
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Short excerpt for card preview..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  Publish Article Live
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Admin Lead Budget Adjuster Modal (₹5k to ₹10L) */}
      {isBudgetModalOpen && selectedLeadForBudget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-md w-full border border-indigo-500/30 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Adjust Lead Budget</h3>
                <p className="text-xs text-slate-400">{selectedLeadForBudget.name} ({selectedLeadForBudget.company})</p>
              </div>
              <button onClick={() => setIsBudgetModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeadBudget} className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Set Monthly Budget (₹5k to ₹10 Lakhs)
                  </label>
                  <span className="text-base font-bold text-indigo-400 font-heading bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                    {adminBudgetSlider < 100000
                      ? `₹${adminBudgetSlider.toLocaleString('en-IN')}`
                      : `₹${(adminBudgetSlider / 100000).toFixed(1).replace('.0', '')} Lakhs`}
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="1000000"
                  step="5000"
                  value={adminBudgetSlider}
                  onChange={(e) => setAdminBudgetSlider(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-900 appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>₹5k</span>
                  <span>₹2.5L</span>
                  <span>₹5.0L</span>
                  <span>₹7.5L</span>
                  <span>₹10.0L+</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  Save Lead Budget
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Add New Pending Work Modal */}
      {isPendingWorkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-lg w-full border border-amber-500/30 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Create Future Pending Work
              </h3>
              <button onClick={() => setIsPendingWorkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePendingWork} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Work / Task Title *</label>
                <input
                  type="text"
                  required
                  value={pendingWorkForm.title}
                  onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, title: e.target.value })}
                  placeholder="e.g. SEO Audit & Core Web Vitals Optimization"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Client / Project Name *</label>
                  <input
                    type="text"
                    required
                    value={pendingWorkForm.clientName}
                    onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, clientName: e.target.value })}
                    placeholder="e.g. ApexCloud Tech"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Service Category</label>
                  <select
                    value={pendingWorkForm.serviceCategory}
                    onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, serviceCategory: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Growth Strategy">Growth Strategy</option>
                    <option value="SEO">SEO & Search</option>
                    <option value="Paid Social">Meta & Paid Social Ads</option>
                    <option value="Web Development">Web Development</option>
                    <option value="AI Automation">AI Workflows</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Due Date *</label>
                  <input
                    type="date"
                    required
                    value={pendingWorkForm.dueDate}
                    onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, dueDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Priority Level</label>
                  <select
                    value={pendingWorkForm.priority}
                    onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, priority: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Work Instructions & Scope *</label>
                <textarea
                  rows={3}
                  required
                  value={pendingWorkForm.description}
                  onChange={(e) => setPendingWorkForm({ ...pendingWorkForm, description: e.target.value })}
                  placeholder="Detail what tasks need to be completed..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPendingWorkModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
                >
                  Save Pending Work
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Upload Proof & Verify Work Modal */}
      {isProofModalOpen && selectedTaskForProof && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-3xl max-w-lg w-full border border-emerald-500/30 space-y-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-emerald-400 font-bold uppercase">Proof Verification Flow</span>
                <h3 className="text-lg font-bold text-white">{selectedTaskForProof.title}</h3>
                <p className="text-xs text-slate-400">Client: {selectedTaskForProof.clientName}</p>
              </div>
              <button onClick={() => setIsProofModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProofAndComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Proof Type *</label>
                <select
                  value={proofForm.proofType}
                  onChange={(e) => setProofForm({ ...proofForm, proofType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Screenshot/Image">Screenshot / Deliverable Image</option>
                  <option value="Live Link">Live Production Link / URL</option>
                  <option value="Document/File">Document / Deliverable File</option>
                </select>
              </div>

              {proofForm.proofType === 'Screenshot/Image' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Upload Proof Image (Screenshot)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProofForm({ ...proofForm, proofDataOrUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none cursor-pointer"
                  />
                  {proofForm.proofDataOrUrl && proofForm.proofDataOrUrl.startsWith('data:image') && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 h-28">
                      <img src={proofForm.proofDataOrUrl} alt="Uploaded Proof Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Deliverable URL / Link *</label>
                  <input
                    type="text"
                    required
                    value={proofForm.proofDataOrUrl}
                    onChange={(e) => setProofForm({ ...proofForm, proofDataOrUrl: e.target.value })}
                    placeholder="https://client-project.com/verified-proof"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Admin Verification Notes *</label>
                <textarea
                  rows={3}
                  required
                  value={proofForm.notes}
                  onChange={(e) => setProofForm({ ...proofForm, notes: e.target.value })}
                  placeholder="Details about client sign-off, work validation, or performance audit..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProofModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gradient px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" /> Verify & Move to Works Done
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Share Task Modal */}
      {isShareModalOpen && selectedTaskForShare && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl p-6 sm:p-8 border-2 border-black dark:border-slate-700 shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600] space-y-6 relative"
          >
            <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-black shrink-0">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-black dark:text-white">Share Pending Work</h3>
                  <p className="text-xs text-slate-700 dark:text-slate-400 font-bold">Share task details with team members or friends</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-2 rounded-lg bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black border border-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Task Snapshot Card */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">📅 Due: {selectedTaskForShare.dueDate}</span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20">
                  {selectedTaskForShare.priority} Priority
                </span>
              </div>
              <h4 className="text-sm font-black text-black dark:text-white">{selectedTaskForShare.title}</h4>
              <div className="text-xs text-indigo-700 dark:text-indigo-400 font-bold">Client: {selectedTaskForShare.clientName}</div>
              <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium line-clamp-3">{selectedTaskForShare.description}</p>
            </div>

            {/* Toast Notification */}
            {copiedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-700 dark:text-emerald-400 text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{copiedToast}</span>
              </div>
            )}

            {/* Share Actions Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleCopyTaskText(selectedTaskForShare)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 hover:bg-[#FFE600] hover:text-black dark:hover:bg-[#FFE600] dark:hover:text-black text-black dark:text-white text-xs font-black flex flex-col items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] cursor-pointer"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Summary</span>
              </button>

              <button
                onClick={() => handleCopyTaskLink(selectedTaskForShare)}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-black dark:border-slate-700 hover:bg-[#FFE600] hover:text-black dark:hover:bg-[#FFE600] dark:hover:text-black text-black dark:text-white text-xs font-black flex flex-col items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#FFFFFF] cursor-pointer"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => handleWhatsAppShare(selectedTaskForShare)}
                className="p-3.5 rounded-xl bg-emerald-600 text-white border-2 border-black hover:bg-emerald-500 text-xs font-black flex flex-col items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleEmailShare(selectedTaskForShare)}
                className="p-3.5 rounded-xl bg-indigo-600 text-white border-2 border-black hover:bg-indigo-500 text-xs font-black flex flex-col items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_#000000] cursor-pointer"
              >
                <Mail className="w-5 h-5" />
                <span>Email Task</span>
              </button>
            </div>

            {/* Native Mobile Share Button */}
            {typeof window !== 'undefined' && 'share' in navigator && (
              <button
                onClick={() => handleNativeWebShare(selectedTaskForShare)}
                className="w-full py-3 rounded-xl bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black border-2 border-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000000] cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>More Share Options (Native Sheet)</span>
              </button>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
