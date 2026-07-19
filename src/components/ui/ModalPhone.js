"use client";

import { useState } from "react";
import { X, Phone, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalPhone({ isOpen, onClose, name, role, phoneNumber }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden z-10 relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-700 p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Hubungi via Telepon</h3>
                  <p className="text-xs text-emerald-100">Koneksi Panggilan Langsung</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest text-[10px]">{role}</p>
                <h4 className="text-xl font-extrabold text-slate-800">{name}</h4>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs leading-relaxed text-center font-medium">
                📢 Mohon maaf, Beliau tidak menggunakan aplikasi WhatsApp. Silakan hubungi secara langsung melalui panggilan telepon biasa.
              </div>

              {/* Phone display field */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-4">
                <span className="font-mono font-bold text-lg text-slate-700 tracking-wider">
                  {phoneNumber}
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
              <a
                href={`tel:${phoneNumber}`}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-colors shadow-md shadow-emerald-700/10"
              >
                <Phone className="w-4 h-4" />
                <span>Panggil Sekarang</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
