"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
        style={{ 
          backgroundImage: "url('/assets/kesenian-placeholder.svg')",
        }}
      />
      
      {/* Soft gradient color overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/80" />

      {/* Floating abstract decorative graphics */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-8 mt-12">
        {/* Animated tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 rounded-full backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-300">
            Official Portal Desa Tempursari
          </span>
        </motion.div>

        {/* Animated Main Title */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight"
          >
            Selamat Datang di <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-amber-300">
              Desa Tempursari
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-slate-300 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Mewujudkan tata kelola desa yang mandiri, asri, berbudaya, serta terintegrasi secara digital untuk kesejahteraan masyarakat.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/peta"
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center space-x-2.5 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5" />
            <span>Jelajahi Peta Desa</span>
          </Link>
          <Link
            href="/profil/demografi"
            className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center space-x-2.5 backdrop-blur-md transition-all hover:-translate-y-0.5"
          >
            <span>Lihat Infografis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Decorative Wave bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] text-slate-50"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,84.77,25.84,149.33,43.39,215.1,56.86,321.39,56.44Z"
          />
        </svg>
      </div>
    </div>
  );
}
