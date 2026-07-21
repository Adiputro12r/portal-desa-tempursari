"use client";

import { use, useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, User, ChevronRight, Share2, Check, ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

function parseImages(foto_url) {
  if (!foto_url) return [];
  try {
    const arr = JSON.parse(foto_url);
    if (Array.isArray(arr)) return arr;
  } catch (_) {}
  return [foto_url];
}

function ImageGallery({ images }) {
  const [current, setCurrent] = useState(0);
  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
        <Image src={images[0]} alt="Foto artikel" fill className="object-cover" priority />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative h-64 sm:h-[400px] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 group">
        <Image src={images[current]} alt={`Foto ${current + 1}`} fill className="object-cover transition-all duration-500" priority />
        {/* Prev / Next */}
        <button
          onClick={() => setCurrent(c => (c - 1 + images.length) % images.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent(c => (c + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        {/* Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {current + 1} / {images.length}
        </div>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`relative w-16 h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              idx === current ? "border-emerald-500 shadow-md" : "border-slate-200 opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={src} alt={`Thumb ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DetailBerita({ params }) {
  const unwrappedParams = params ? (typeof params.then === "function" ? use(params) : params) : {};
  const id = unwrappedParams?.id;
  const router = useRouter();

  const [artikel, setArtikel] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchArtikel = async () => {
      try {
        const [{ data: artikelData }, { data: recData }] = await Promise.all([
          supabase.from("artikel").select("*").eq("id", id).single(),
          supabase.from("artikel").select("*").neq("id", id).order("created_at", { ascending: false }).limit(3)
        ]);
        if (artikelData) {
          setArtikel(artikelData);
          document.title = `${artikelData.judul} - Portal Desa Tempursari`;
        }
        if (recData) setRecommendations(recData);
      } catch (_) {}
      finally { setLoading(false); }
    };
    fetchArtikel();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
          <div className="h-4 bg-slate-200 rounded w-48" />
          <div className="h-8 bg-slate-200 rounded w-3/4" />
          <div className="h-[400px] bg-slate-200 rounded-2xl" />
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-4 bg-slate-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

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

  const images = parseImages(artikel.foto_url);

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-8">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/kabar-desa" className="hover:text-emerald-700 transition-colors">Kabar Desa</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">{artikel.judul}</span>
        </nav>

        {/* Action Bar */}
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
              copied ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Tautan Tersalin!" : "Bagikan Berita"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Article */}
          <article className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 md:p-10 space-y-6">
            <div className="space-y-4">
              <span className="inline-block bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                {artikel.kategori}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-snug">
                {artikel.judul}
              </h1>
            </div>

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

            {/* Image Gallery */}
            <ImageGallery images={images} />

            {/* Content - rendered as HTML */}
            <div
              className="text-slate-600 text-sm md:text-base leading-relaxed font-medium pt-2
                [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-800 [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-700 [&_h3]:mt-4 [&_h3]:mb-2
                [&_strong]:font-bold [&_em]:italic
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-3
                [&_hr]:border-slate-200 [&_hr]:my-6
                [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: artikel.konten || "" }}
            />
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-6 space-y-6">
              <h3 className="font-extrabold text-base text-slate-800 border-b border-slate-100 pb-3">Kabar Lainnya</h3>
              <div className="space-y-6">
                {recommendations.map((rec) => {
                  const recImg = parseImages(rec.foto_url)[0] || "/assets/kesenian-placeholder.svg";
                  return (
                    <Link key={rec.id} href={`/kabar-desa/${rec.id}`} className="flex space-x-4 items-start group">
                      <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <Image src={recImg} alt={rec.judul} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
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
                  );
                })}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
