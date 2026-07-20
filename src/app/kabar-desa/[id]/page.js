"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, ChevronRight, Share2, Clipboard, Check } from "lucide-react";
import { beritaData } from "@/data/beritaData";

export default function DetailBerita({ params }) {
  // Safe resolution of params for Next.js App Router
  const unwrappedParams = params ? (typeof params.then === "function" ? use(params) : params) : {};
  const id = unwrappedParams?.id;
  const router = useRouter();

  const [copied, setCopied] = useState(false);

  const artikel = beritaData.find((b) => b.id === id);

  useEffect(() => {
    if (artikel) {
      document.title = `${artikel.judul} - Portal Desa Tempursari`;
    }
  }, [artikel]);


  // Fallback if article not found
  if (!artikel) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4 min-h-screen">
        <h2 className="text-2xl font-extrabold text-slate-800">Berita Tidak Ditemukan</h2>
        <p className="text-sm text-slate-400">Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
        <Link href="/kabar-desa" className="inline-flex items-center space-x-2 text-emerald-700 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kabar Desa</span>
        </Link>
      </div>
    );
  }

  // Get other recommended articles
  const recommendations = beritaData.filter((b) => b.id !== id).slice(0, 2);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-8">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kabar-desa" className="hover:text-emerald-700 transition-colors">Kabar Desa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">{artikel.judul}</span>
        </nav>

        {/* Action Bar (Back & Share) */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-emerald-700 text-xs font-bold transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Kembali</span>
          </button>
          
          <button
            onClick={handleShare}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              copied
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Tautan Tersalin!" : "Bagikan Berita"}</span>
          </button>
        </div>

        {/* Main Article Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Article Core */}
          <article className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 space-y-6">
            
            {/* Category badge & Title */}
            <div className="space-y-4">
              <span className="inline-block bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                {artikel.kategori}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-snug">
                {artikel.judul}
              </h1>
            </div>

            {/* Metadata (Author & Date) */}
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400 border-y border-slate-100 py-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{artikel.tanggal}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span>Oleh {artikel.author}</span>
              </div>
            </div>

            {/* Main Cover Image */}
            <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
              <Image
                src={artikel.foto_url}
                alt={artikel.judul}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Paragraph Contents */}
            <div className="text-slate-600 text-sm md:text-base leading-relaxed space-y-4 font-medium pt-4">
              {artikel.konten.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

          </article>

          {/* Recommendations Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 space-y-6">
              <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">
                Kabar Lainnya
              </h3>
              
              <div className="space-y-6">
                {recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    href={`/kabar-desa/${rec.id}`}
                    className="flex space-x-4 items-start group"
                  >
                    {/* Rec Thumbnail */}
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={rec.foto_url}
                        alt={rec.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Rec Text */}
                    <div className="space-y-1.5 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {rec.judul}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[9px] font-bold text-slate-400 uppercase">
                        <Calendar className="w-3 h-3" />
                        <span>{rec.tanggal}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
