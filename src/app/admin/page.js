"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  Newspaper, 
  ShoppingBag, 
  Compass, 
  Users, 
  Settings,
  Info,
  ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    berita: 3,
    umkm: 2,
    wisata: 2,
    aparat: 7
  });

  // Query actual stats from Supabase on mount
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          { count: countBerita },
          { count: countUmkm },
          { count: countWisata },
          { count: countAparat }
        ] = await Promise.all([
          supabase.from("artikel").select("*", { count: "exact", head: true }),
          supabase.from("umkm").select("*", { count: "exact", head: true }),
          supabase.from("objek_wisata").select("*", { count: "exact", head: true }),
          supabase.from("pemerintah_desa").select("*", { count: "exact", head: true })
        ]);

        setStats({
          berita: countBerita ?? 3,
          umkm: countUmkm ?? 2,
          wisata: countWisata ?? 2,
          aparat: countAparat ?? 7
        });
      } catch (err) {
        console.warn("Koneksi Supabase belum terkonfigurasi. Menggunakan jumlah dummy data.");
      }
    };

    fetchCounts();
  }, []);

  const statItems = [
    { label: "Kabar Berita", value: stats.berita, href: "/admin/berita", icon: Newspaper, color: "bg-blue-500" },
    { label: "UMKM Desa", value: stats.umkm, href: "/admin/umkm", icon: ShoppingBag, color: "bg-amber-500" },
    { label: "Objek Wisata", value: stats.wisata, href: "/admin/wisata", icon: Compass, color: "bg-sky-500" },
    { label: "Pemerintah Desa", value: stats.aparat, href: "/admin/pemerintah", icon: Users, color: "bg-emerald-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Ringkasan Portal</h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Status database dan konten desa saat ini</p>
      </div>

      {/* Grid Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="bg-white rounded-3xl border border-slate-200/50 shadow-xl shadow-slate-100/30 p-6 flex items-center justify-between group hover:border-emerald-500/20 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl text-white ${item.color} shadow-lg shadow-slate-100`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tight mt-0.5">{item.value}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
            </Link>
          );
        })}
      </div>

      {/* Info & Instructions Card */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/30 p-8 space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <Settings className="w-6 h-6 text-emerald-600" />
          <h3 className="font-extrabold text-lg text-slate-800">Panduan Sinkronisasi Database</h3>
        </div>

        <div className="space-y-4 text-xs font-medium text-slate-600 leading-relaxed">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-emerald-50 rounded-md shrink-0">
              <Info className="w-4 h-4 text-emerald-700" />
            </div>
            <p>
              <strong>Koneksi Database:</strong> Konfigurasikan kredensial Supabase Anda di berkas <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">.env.local</code>. Pastikan Anda telah membuat tabel-tabel database menggunakan berkas <code className="bg-slate-100 px-1.5 py-0.5 rounded text-emerald-700 font-mono">src/db/schema.sql</code>.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-1 bg-emerald-50 rounded-md shrink-0">
              <Info className="w-4 h-4 text-emerald-700" />
            </div>
            <p>
              <strong>3 Akun Admin Awal:</strong> Pastikan Anda telah menambahkan 3 akun admin yang terdaftar di database Supabase Auth dengan email berikut untuk keperluan koordinasi KKN:
            </p>
          </div>

          <ul className="pl-10 list-disc space-y-1.5 font-bold text-slate-700">
            <li>admin1@tempursari.desa.id</li>
            <li>admin2@tempursari.desa.id</li>
            <li>admin3@tempursari.desa.id</li>
          </ul>

          <div className="flex items-start space-x-3 pt-2">
            <div className="p-1 bg-emerald-50 rounded-md shrink-0">
              <Info className="w-4 h-4 text-emerald-700" />
            </div>
            <p>
              <strong>Row Level Security (RLS):</strong> Sistem website ini menggunakan keamanan RLS PostgreSQL. Siapa pun dapat mengunjungi dan membaca berita atau peta, namun operasi penulisan, pengeditan, atau penghapusan data wajib login dengan salah satu akun admin di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
