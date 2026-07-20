"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setMounted(true);
    // Keep splash visible for 1.8 seconds, then fade out
    const timer = setTimeout(() => {
      setShow(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;


  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 z-[9999] flex flex-col items-center justify-center text-white"
        >
          {/* Pulsing logo icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20"
          >
            <svg
              className="w-12 h-12 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </motion.div>

          {/* Glowing Animated Text */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 via-emerald-300 to-green-100 drop-shadow-md text-center px-4"
          >
            DESA TEMPURSARI
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="w-32 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-4"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-xs uppercase tracking-widest text-emerald-200/70 mt-3 font-semibold"
          >
            Kuliah Kerja Nyata 2026
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
