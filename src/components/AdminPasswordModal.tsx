import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, X, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginAdmin } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Slight delay to simulate scanning & secure validation check
    setTimeout(() => {
      const ok = loginAdmin(password);
      setIsSubmitting(false);
      if (ok) {
        setPassword('');
        onSuccess();
        onClose();
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-blue-500/20 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Hologram top edge light */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Shield className="w-7 h-7 animate-pulse" />
                <div className="absolute -inset-1 rounded-full border border-blue-500/10 animate-ping [animation-duration:3s]" />
              </div>
              <h3 className="text-xl font-bold font-sans text-white tracking-wide">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
                System Authorization Level 1
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold font-mono text-blue-400/80 uppercase tracking-wider">
                  Access Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-700 bg-slate-950/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 font-mono transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl text-sm font-semibold tracking-wider font-mono shadow-lg shadow-purple-900/15 border border-purple-500/20 active:translate-y-px transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>VERIFYING HASH...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>AUTHORIZE ACCESS</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                Nahom Debebe Portfolio Console
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
