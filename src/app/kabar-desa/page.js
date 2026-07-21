"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, Search, Newspaper } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { beritaData as fallbackData } from "@/data/beritaData";

const CACHE_KEY = "kabar_desa_list_cache";
const CACHE_TTL = 3 * 60 * 1000;

function parseFirstImage(foto_url) {
  if (!foto_url) return "/assets/kesenian-placeholder.svg";
  try {
    const arr = JSON.parse(foto_url);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch (_) {}
  return foto_url;
}

function BeritaSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-6 space-y-3">
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-5 bg-slate-200 rounded w-full" />
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
    </div>
  );
}

export default function KabarDesa() {
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  useEffect(() => {
    document.title = "Kabar Desa - Portal Desa Tempursari";

    // Step 1: cache
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (data?.length > 0) {
          setBeritaList(data);
          setLoading(false);
          if (Date.now() - timestamp < CACHE_TTL) return;
        }
      }
    } catch (_) {}

    // Step 2: Supabase
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data?.length > 0) {
          setBeritaList(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          setBeritaList(prev => prev.length > 0 ? prev : fallbackData);
        }
      } catch (_) {
        setBeritaList(prev => prev.length > 0 ? prev : fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const categories = ["Semua", "Kegiatan", "Pembangunan", "Kesenian & Budaya"];

  const filtered = beritaList.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = b.judul?.toLowerCase().includes(q) || (b.konten?.replace(/<[^>]*>/g, "").toLowerCase().includes(q));
    const matchCat = selectedCategory === "Semua" || b.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Newspaper className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Kabar Desa Tempursari</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Temukan berita terkini, pengumuman resmi, dan liputan kegiatan warga Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >{cat}</button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <BeritaSkeleton key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((berita) => {
              const coverImg = parseFirstImage(berita.foto_url);
              return (
                <div
                  key={berita.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <Image
                      src={coverImg}
                      alt={berita.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                      {berita.kategori}
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{berita.tanggal}</span>
                        <span>•</span>
                        <span>Oleh {berita.author}</span>
                      </div>
                      <h3 className="font-extrabold text-base text-slate-800 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                        {berita.judul}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {(berita.konten || "").replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                    <Link
                      href={`/kabar-desa/${berita.id}`}
                      className="inline-flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-600 font-bold text-xs uppercase tracking-wider group/link"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Baca Selengkapnya</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-md space-y-2">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-700">Tidak Ada Berita</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">Tidak ditemukan berita yang sesuai dengan pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
