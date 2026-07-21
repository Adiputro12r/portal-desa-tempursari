/**
 * Home Page — Server Component.
 *
 * Data kades, artikel terbaru, dan aparat di-fetch di server.
 * HTML yang dikirim ke browser sudah berisi data asli dari Supabase —
 * tidak ada dummy data, tidak ada loading state untuk konten utama.
 *
 * `force-dynamic` → render di server setiap request (no ISR cache).
 * Perubahan data Supabase langsung tampil tanpa delay.
 */
export const dynamic = 'force-dynamic';

import Link from "next/link";
import ImageWithLoading from "@/components/ui/ImageWithLoading";
import { ArrowRight, BookOpen, Calendar, MapPin, Award, Users, Landmark } from "lucide-react";
import HeroSection from "@/components/sections/HeroSection";
import AparatSlider from "@/components/sections/AparatSlider";
import { fetchKades, fetchArtikel } from "@/lib/fetchData";

export default async function Home() {
  // Fetch paralel — keduanya jalan bersamaan, tidak nunggu satu per satu
  const [kadesInfo, recentArticles] = await Promise.all([
    fetchKades(),
    fetchArtikel(3),
  ]);

  const stats = [
    { label: "Jumlah Penduduk", value: "1,795 Orang", icon: Users, color: "bg-emerald-100 text-emerald-700" },
    { label: "Luas Wilayah", value: "98.0 Ha", icon: MapPin, color: "bg-amber-100 text-amber-700" },
    { label: "Dusun Administratif", value: "2 Wilayah", icon: Landmark, color: "bg-blue-100 text-blue-700" },
    { label: "UMKM Aktif", value: "12+ Unit", icon: Award, color: "bg-rose-100 text-rose-700" },
  ];

  return (
    <div className="space-y-0">
      {/* 1. Hero Welcome Banner */}
      <HeroSection />

      {/* 2. Quick Infographics Stats Bar */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center space-x-4 p-2">
                <div className={`p-3.5 rounded-xl shrink-0 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-base md:text-lg font-black text-slate-800 tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Sejarah & Sambutan Kades */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Kades Photo */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-72 h-80 bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden shadow-2xl group">
                <ImageWithLoading
                  src={kadesInfo.foto}
                  alt="Kepala Desa Tempursari"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  skeletonText="Memuat foto..."
                />
              </div>
              <div className="text-center mt-4">
                <h4 className="font-extrabold text-lg text-slate-800">{kadesInfo.nama}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kepala Desa Tempursari</p>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest block">
                Sambutan Kepala Desa
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Mewujudkan Tempursari yang Mandiri dan Sejahtera
              </h2>
              <div className="w-16 h-[3px] bg-amber-500 rounded-full" />
              <p className="text-slate-600 text-sm leading-relaxed">
                "Selamat datang di portal informasi resmi Desa Tempursari. Website ini hadir sebagai wujud komitmen kami dalam memajukan desa di era digital, meningkatkan transparansi publik, dan mendekatkan pelayanan kepada masyarakat."
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kami berkomitmen untuk terus melestarikan kesenian daerah, mempromosikan produk UMKM warga, dan mempermudah akses peta tata ruang desa demi kemudahan koordinasi pembangunan. Kami berharap portal ini bermanfaat bagi seluruh masyarakat dan publik yang ingin mengenal potensi Desa Tempursari.
              </p>
              <div className="pt-2">
                <Link
                  href="/profil/lembaga"
                  className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-600 font-bold text-xs uppercase tracking-wider group"
                >
                  <span>Mengenal Lembaga Desa</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Struktur Pemerintah Desa (Interactive Carousel) */}
      {/* AparatSlider adalah Server Component yang fetch data-nya sendiri */}
      <AparatSlider />

      {/* 5. Kabar Desa / Berita Terkini */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div className="space-y-2">
              <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest block">
                Kabar Terkini
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Berita & Kegiatan Desa
              </h2>
              <p className="text-slate-500 text-sm">
                Ikuti perkembangan berita pembangunan, pengumuman resmi, dan kegiatan sosial warga Tempursari.
              </p>
            </div>
            <Link
              href="/kabar-desa"
              className="inline-flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-5 py-3 rounded-xl transition-all mt-6 sm:mt-0 tracking-wider"
            >
              <span>Semua Berita</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid Berita — data sudah ada dari server, langsung render */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((artikel) => (
              <div
                key={artikel.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col group hover:-translate-y-1 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <ImageWithLoading
                    src={artikel.foto_url}
                    alt={artikel.judul}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    skeletonText="Memuat foto..."
                  />
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                    {artikel.kategori}
                  </div>
                </div>

                {/* Text Body */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{artikel.tanggal}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-800 tracking-tight leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                      {artikel.judul}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {(artikel.konten || "").replace(/<[^>]*>/g, "")}
                    </p>
                  </div>

                  <Link
                    href={`/kabar-desa/${artikel.id}`}
                    className="inline-flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-600 font-bold text-xs uppercase tracking-wider group/link"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Baca Selengkapnya</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
