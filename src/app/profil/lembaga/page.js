"use client";

import Image from "next/image";
import { Landmark, ShieldCheck } from "lucide-react";
import { lembagaData } from "@/data/demografiData";

export default function LembagaDesa() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <Landmark className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Lembaga Kemasyarakatan Desa</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Mengenal organisasi sosial dan wadah aspirasi gotong-royong warga di Desa Tempursari.
          </p>
        </div>
      </section>

      {/* Main Grid content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {lembagaData.map((lembaga) => (
            <div
              key={lembaga.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 hover:border-emerald-500/20 transition-all duration-300 group"
            >
              {/* Logo / Icon Container */}
              <div className="relative w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0 p-3 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={lembaga.logo_url}
                  alt={lembaga.nama_lembaga}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Text Info Description */}
              <div className="space-y-3 text-center md:text-left flex-grow">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {lembaga.nama_lembaga}
                  </h3>
                  <span className="inline-flex self-center md:self-start items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lembaga Resmi</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {lembaga.deskripsi}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
