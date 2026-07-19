"use client";

import dynamic from "next/dynamic";
import { Compass, AlertTriangle } from "lucide-react";

// Dynamically import Leaflet map component with ssr: false to prevent "window is not defined" SSR errors.
const VillageMap = dynamic(
  () => import("@/components/map/VillageMap"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-8 h-[600px] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Loading Peta Interaktif...</p>
      </div>
    ),
  }
);

export default function PetaInteraktif() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Compass className="w-12 h-12 text-emerald-400 mx-auto animate-spin-slow" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Peta Interaktif Desa</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Visualisasi pemetaan spasial Desa Tempursari. Navigasi batas wilayah dusun, potensi UMKM, fasilitas umum, dan objek wisata desa.
          </p>
        </div>
      </section>

      {/* Main Map Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Warning/Info Box */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start space-x-3 mb-8 text-emerald-800 text-xs font-semibold leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            💡 Info Penggunaan Peta: Gunakan gestur dua jari di layar HP (pinch) atau scroll mouse di desktop untuk zoom-in/out. Klik area Dusun atau Klik Pin Marker merah/kuning/biru untuk melihat keterangan detail lokasi masing-masing tempat.
          </div>
        </div>

        {/* Dynamic Leaflet Component */}
        <VillageMap />
        
      </div>
    </div>
  );
}
