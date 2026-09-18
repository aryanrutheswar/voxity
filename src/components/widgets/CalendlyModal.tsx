'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalendarIcon, CheckCircle2, Video, Mic, Square, Trash2, Volume2, AlertCircle, FileText, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [booked, setBooked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timer and mediaRecorder on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone recording error:', err);
      setMicError('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordingTime(0);
    setMicError(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    if (isRecording) {
      stopRecording();
    }

    setLoading(true);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          slot: '30 Min Strategy Audit (ASAP)',
          notes,
          audioNote: audioBase64
        })
      });
      setBooked(true);
      confetti({ particleCount: 80, spread: 60 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-xl p-6 sm:p-8 relative border-2 border-black dark:border-slate-700 text-left shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#FFE600] max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-md bg-black text-[#FFE600] dark:bg-[#FFE600] dark:text-black border border-black cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FFE600] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white">Strategy Session Confirmed!</h3>
            <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold">
              Your session has been logged in our database. We sent a Google Meet invitation to <span className="text-black dark:text-[#FFE600] font-black">{email}</span>.
            </p>
            {notes && (
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-medium text-left">
                <span className="font-bold text-black dark:text-white flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> Your Note:
                </span>
                <p className="italic">{notes}</p>
              </div>
            )}
            {audioBase64 && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4" /> Voice message attached & sent to admin!
              </div>
            )}
            <div className="p-3 rounded-lg bg-[#FFE600]/20 dark:bg-[#FFE600]/10 border-2 border-black dark:border-[#FFE600] text-xs text-black dark:text-white font-black">
              📅 30 Min Strategy Audit Session (ASAP Confirmation)
            </div>
            <button
              onClick={() => {
                setBooked(false);
                setNotes('');
                setPhone('');
                deleteRecording();
                onClose();
              }}
              className="px-6 py-2.5 rounded-md btn-gradient text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-black dark:text-[#FFE600] font-black text-xs mb-2 uppercase tracking-wider">
              <Video className="w-4 h-4 text-black dark:text-[#FFE600]" /> 1-on-1 Executive Growth Audit
            </div>
            <h3 className="text-2xl font-black text-black dark:text-white mb-2">Book Your Strategy Call</h3>
            <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold mb-6">
              Meet directly with our Senior Growth Strategist to review your current marketing bottlenecks.
            </p>

            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:outline-none focus:border-black dark:focus:border-[#FFE600]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 mb-1.5">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:outline-none focus:border-black dark:focus:border-[#FFE600]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-500" /> Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-1234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:outline-none focus:border-black dark:focus:border-[#FFE600]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" /> Project Details / What You Want To Discuss
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Type your specific goals, project details, target budget, or questions you want to cover..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs text-black dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-semibold focus:outline-none focus:border-black dark:focus:border-[#FFE600] resize-none"
                />
              </div>

              {/* Microphone Voice Note Section */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-black uppercase tracking-wider text-black dark:text-slate-200 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-rose-500 animate-pulse" /> Voice Requirement Note
                  </label>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">(Optional)</span>
                </div>

                {micError && (
                  <div className="flex items-center gap-2 p-2 rounded bg-rose-500/10 text-rose-500 text-[11px] font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{micError}</span>
                  </div>
                )}

                {!isRecording && !audioUrl && (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      Explain what you want to achieve directly via voice message to our strategists.
                    </p>
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-3.5 py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      <Mic className="w-3.5 h-3.5" /> Record Voice
                    </button>
                  </div>
                )}

                {isRecording && (
                  <div className="flex items-center justify-between gap-3 p-2 bg-rose-500/10 border border-rose-500/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="text-xs font-black text-rose-500 font-mono tracking-wider">
                        Recording... {formatTime(recordingTime)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-3 py-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000000]"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Stop
                    </button>
                  </div>
                )}

                {audioUrl && !isRecording && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Volume2 className="w-4 h-4" /> Voice Recorded ({formatTime(recordingTime)})
                      </span>
                      <button
                        type="button"
                        onClick={deleteRecording}
                        className="text-rose-500 hover:text-rose-600 flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Re-record
                      </button>
                    </div>

                    <audio controls src={audioUrl} className="w-full h-9 rounded-md accent-[#FFE600]" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3.5 rounded-md font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#000000] mt-4 cursor-pointer"
              >
                {loading ? 'Saving Booking...' : 'Confirm & Add to Google Calendar'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}
