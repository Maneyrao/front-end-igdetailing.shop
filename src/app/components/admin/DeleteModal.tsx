import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export function DeleteModal({ title, message, onConfirm, onClose }: {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl border border-[#1E2030] bg-[#0A0A12] p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-[#64748B] mb-6">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#1E2030] py-2 text-sm text-[#94A3B8] hover:text-white transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-400 transition"
          >
            Eliminar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
