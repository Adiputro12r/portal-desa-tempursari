"use client";

import Image from "next/image";
import { Music, Calendar, MapPin, Sparkles } from "lucide-react";
import { kesenianData } from "@/data/umkmWisataData";

export default function KesenianDaerah() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{ backgroundImage: "url('/assets/kesenian-jathilan.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-amber-200 to-white">
            Kesenian & Budaya Tempursari
          </h1>
          <p className="text-emerald-100/90 max-w-xl mx-auto text-sm md:text-base font-medium">
            Melestarikan warisan leluhur dan merawat identitas luhur budaya jawa di lereng pegunungan Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Intro Narration */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4 mb-16">
        <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest block">Warisan Nusantara</span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Merawat Tradisi, Menghidupkan Kesenian</h2>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">
          Desa Tempursari memiliki akar kebudayaan yang kuat yang diwariskan secara turun-temurun. Kesenian tari tradisional dan lantunan gending karawitan bukan sekadar sarana hiburan warganya, melainkan juga wadah mempererat silaturahmi gotong royong dan wujud syukur terhadap limpahan rezeki dari Tuhan Yang Maha Esa.
        </p>
      </div>

      {/* Grid Kesenian */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {kesenianData.map((seni) => (
            <div
              key={seni.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col group hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Photo Banner */}
              <div className="relative h-64 sm:h-72 bg-slate-100 overflow-hidden">
                <Image
                  src={seni.foto_url}
                  alt={seni.nama_kesenian}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <Music className="w-3.5 h-3.5" />
                  <span>Seni Tradisional</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xl text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {seni.nama_kesenian}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {seni.deskripsi}
                  </p>
                </div>

                {/* Schedule badge box */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center space-x-3 text-slate-700">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jadwal Pentas / Latihan</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{seni.jadwal_kegiatan}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
