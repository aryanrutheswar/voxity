'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Mail, Key, UserCheck, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, Lock, User
} from 'lucide-react';
import { VoxLogo } from '@/components/widgets/VoxLogo';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Sign-In Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMsg(`Welcome back, ${data.user.name}! Redirecting...`);
      login(data.user, data.token);

      setTimeout(() => {
        router.push(data.redirectUrl || '/dashboard');
      }, 500);
    } catch (err) {
      setErrorMsg('Network error connecting to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      setSuccessMsg('Account created successfully! Logging you in...');
      login(data.user, data.token);

      setTimeout(() => {
        router.push(data.redirectUrl || '/dashboard');
      }, 600);
    } catch (err) {
      setErrorMsg('Network error creating your account.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      const { redirectUrl } = await loginWithGoogle();
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans flex flex-col justify-between selection:bg-[#FFE600] selection:text-black transition-colors duration-300">
      {/* Top Header */}
      <header className="p-6 border-b border-slate-800 bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group text-slate-300 hover:text-[#FFE600] transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-wider">Back to Agency Home</span>
          </a>

          <a href="/" className="flex items-center gap-2 group cursor-pointer hover:opacity-90 transition-opacity">
            <VoxLogo size="sm" />
            <span className="font-black text-sm text-white uppercase tracking-wider">
              {isRegistering ? 'Account Registration' : 'Portal Access'}
            </span>
          </a>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-xl bg-[#FFE600] text-black border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_#FFFFFF]">
              {isRegistering ? <User className="w-7 h-7 text-black" /> : <Lock className="w-7 h-7 text-black" />}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              {isRegistering ? 'Create Your Account' : 'Sign In to Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {isRegistering
                ? 'Join Vox.ity to access client dashboards, project briefs, and growth tracking.'
                : 'Enter your credentials to access your client dashboard or admin portal.'}
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-rose-500/20 border-2 border-rose-500 text-rose-200 text-xs font-bold flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <div className="bg-[#0F172A] p-7 rounded-2xl space-y-6 border-2 border-slate-700 shadow-[6px_6px_0px_#FFE600]">
            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  !isRegistering
                    ? 'bg-[#FFE600] text-black border border-black shadow-[2px_2px_0px_#000000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isRegistering
                    ? 'bg-[#FFE600] text-black border border-black shadow-[2px_2px_0px_#000000]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* SIGN IN FORM */}
            {!isRegistering ? (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border-2 border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-950 border-2 border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-3.5 rounded-lg bg-[#FFE600] text-black border-2 border-black font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#FFFFFF] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* CREATE ACCOUNT / REGISTER FORM */
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border-2 border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950 border-2 border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-300 mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a strong password (min 6 chars)"
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-950 border-2 border-slate-700 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-[#FFE600] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full py-3.5 rounded-lg bg-[#FFE600] text-black border-2 border-black font-black text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#FFFFFF] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : 'Create Account & Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-bold text-slate-500 border-t border-slate-800">
        © 2026 Vox.ity Agency. Client & Admin Access.
      </footer>
    </div>
  );
}
