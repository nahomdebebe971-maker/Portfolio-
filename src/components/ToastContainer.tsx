import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all ${
              t.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : 'bg-slate-900/85 border-blue-500/30 text-blue-200'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />}
            {t.type === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />}

            <div className="flex-1 text-sm font-medium tracking-wide">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-md hover:bg-white/10 text-white/45 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
