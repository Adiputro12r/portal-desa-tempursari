"use client";

import { useState, useEffect } from "react";
import { useMinLoading } from "@/lib/useMinLoading";
import Image from "next/image";
import { Landmark, ChevronRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { lembagaData as fallback } from "@/data/demografiData";

const CACHE_KEY = "lembaga_desa_cache";
const CACHE_TTL = 5 * 60 * 1000;

function parseFirstImage(foto_url) {
  if (!foto_url) return null;
  try {
    const arr = JSON.parse(foto_url);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch (_) {}
  return foto_url;
}

function SectionSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-pulse space-y-0">
      <div className="h-72 bg-slate-200" />
      <div className="p-8 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
    </div>
  );
}

export default function LembagaDesa() {
  const [sections, setSections] = useState([]);
  const [loading, , stopLoading] = useMinLoading(1000);

  useEffect(() => {
    document.title = "Lembaga Desa - Portal Desa Tempursari";

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (data?.length > 0) {
          setSections(data);
          stopLoading();
          if (Date.now() - timestamp < CACHE_TTL) return;
        }
      }
    } catch (_) {}

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("lembaga_desa")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data?.length > 0) {
          setSections(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          setSections(prev => prev.length > 0 ? prev : fallback);
        }
      } catch (_) {
        setSections(prev => prev.length > 0 ? prev : fallback);
      } finally {
        stopLoading();
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Landmark className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Lembaga Desa Tempursari</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Mengenal lembaga-lembaga kemasyarakatan dan pemerintahan yang aktif di Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-emerald-700 transition-colors">Beranda</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600">Lembaga Desa</span>
        </nav>
      </div>

      {/* Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {loading ? (
          [1, 2].map(i => <SectionSkeleton key={i} />)
        ) : (
          sections.map((section, idx) => {
            const img = parseFirstImage(section.foto_url || section.logo_url);
            const content = section.deskripsi || section.konten || "";
            const isHtml = content.includes("<");
            return (
              <div key={section.id || idx} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                {/* Photo */}
                {img && (
                  <div className="relative w-full" style={{ aspectRatio: img.startsWith("data:image/svg") ? "16/7" : "16/9", maxHeight: "480px", overflow: "hidden" }}>
                    <Image
                      src={img}
                      alt={section.nama_lembaga || "Lembaga Desa"}
                      fill
                      className="object-contain bg-slate-50"
                    />
                  </div>
                )}

                {/* Text content */}
                <div className="p-8 md:p-12">
                  <h2 className="text-2xl font-extrabold text-slate-800 mb-4">
                    {section.nama_lembaga || section.judul || "Lembaga Desa"}
                  </h2>

                  {isHtml ? (
                    <div
                      className="text-slate-600 text-sm md:text-base leading-relaxed
                        [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-800 [&_h2]:mt-6 [&_h2]:mb-3
                        [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-700 [&_h3]:mt-4 [&_h3]:mb-2
                        [&_strong]:font-bold [&_em]:italic
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-3
                        [&_hr]:border-slate-200 [&_hr]:my-6
                        [&_p]:mb-4"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{content}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
