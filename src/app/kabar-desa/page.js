"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Calendar, Search, Newspaper } from "lucide-react";
import { beritaData } from "@/data/beritaData";

export default function KabarDesa() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = ["Semua", "Kegiatan", "Pembangunan", "Kesenian & Budaya"];

  const filteredBerita = beritaData.filter((berita) => {
    const matchesSearch =
      berita.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      berita.konten.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "Semua" || berita.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Newspaper className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Kabar Desa Tempursari</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Temukan berita terkini, pengumuman resmi, dan liputan khusus kegiatan warga di wilayah Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar input */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
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

      {/* News Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredBerita.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredBerita.map((berita) => (
              <div
                key={berita.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <Image
                    src={berita.foto_url}
                    alt={berita.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                    {berita.kategori}
                  </div>
                </div>

                {/* Text Body */}
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
                      {berita.konten}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-md space-y-2">
            <Newspaper className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-lg text-slate-700">Tidak Ada Berita</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tidak dapat menemukan berita yang sesuai dengan kata kunci pencarian atau kategori Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
