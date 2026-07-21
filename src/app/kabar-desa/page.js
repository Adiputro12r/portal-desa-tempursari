// Server Component — tidak ada "use client"
// Data artikel di-fetch di server, dikirim ke BeritaClient sebagai props.
export const dynamic = "force-dynamic";

import { Newspaper } from "lucide-react";
import { getAllArticles } from "@/lib/queries";
import BeritaClient from "@/components/sections/BeritaClient";

export const metadata = {
  title: "Kabar Desa - Portal Desa Tempursari",
  description:
    "Temukan berita terkini, pengumuman resmi, dan liputan kegiatan warga Desa Tempursari.",
};

export default async function KabarDesa() {
  // Fetch semua artikel di server — data sudah ada sebelum HTML dikirim
  const articles = await getAllArticles();

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Newspaper className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Kabar Desa Tempursari
          </h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Temukan berita terkini, pengumuman resmi, dan liputan kegiatan warga
            Desa Tempursari.
          </p>
        </div>
      </section>

      {/*
        BeritaClient: Client Component yang handle filter/search.
        Menerima semua artikel yang sudah di-fetch dari server.
        Filter kategori & search terjadi di sisi client (instant, tanpa request baru).
      */}
      <BeritaClient articles={articles} />
    </div>
  );
}
