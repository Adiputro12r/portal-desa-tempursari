"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin, Heart, Lock } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname && (pathname.startsWith("/admin") || pathname === "/login")) {
    return null;
  }

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Col 1: Logo & Brief Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center border border-emerald-500">
                <span className="text-white font-black text-sm">TS</span>
              </div>
              <span className="font-extrabold text-lg text-white tracking-wide">
                Desa Tempursari
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Portal Informasi dan Infografis Resmi Pemerintah Desa Tempursari. Media transparansi publik, kebudayaan, objek wisata, dan peta potensi desa.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Navigasi</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/kabar-desa" className="hover:text-emerald-400 transition-colors">Kabar Desa</Link>
              </li>
              <li>
                <Link href="/umkm-wisata" className="hover:text-emerald-400 transition-colors">UMKM & Wisata</Link>
              </li>
              <li>
                <Link href="/kesenian" className="hover:text-emerald-400 transition-colors">Kesenian Daerah</Link>
              </li>
              <li>
                <Link href="/profil/lembaga" className="hover:text-emerald-400 transition-colors">Lembaga Desa</Link>
              </li>
              <li>
                <Link href="/profil/demografi" className="hover:text-emerald-400 transition-colors">Demografi</Link>
              </li>
              <li className="col-span-2">
                <Link href="/peta" className="hover:text-emerald-400 transition-colors font-bold text-emerald-500">Peta Interaktif</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Jl. Raya Tempursari No. 01, Tempursari, Yogyakarta</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>(0274) 123-4567 / 0812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="break-all">info@tempursari.desa.id</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer & Credit Watermark */}
      <div className="bg-slate-900/60 py-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <p>© 2026 Pemerintah Desa Tempursari. Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <div className="flex items-center space-x-1">
              <span>Dibuat dengan</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>oleh</span>
              <span className="text-emerald-400 font-bold hover:underline cursor-pointer">
                Tim KKN Desa Tempursari 2026
              </span>
            </div>
            
            {/* Explicit Admin Portal Button */}
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-[11px] font-extrabold tracking-wider uppercase transition-all shadow-md shadow-emerald-950/50 hover:scale-105" 
              title="Akses Dashboard Admin Desa"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


