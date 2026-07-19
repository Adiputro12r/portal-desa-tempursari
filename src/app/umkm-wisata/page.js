"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBag, Compass, MapPin, Phone, MessageSquare, ExternalLink } from "lucide-react";
import { umkmData, wisataData } from "@/data/umkmWisataData";

export default function UmkmWisata() {
  const [activeTab, setActiveTab] = useState("semua"); // semua, umkm, wisata

  const handleWaContact = (umkm) => {
    const cleanPhone = umkm.kontak.replace("+", "");
    window.open(`https://wa.me/${cleanPhone}?text=Halo%20${umkm.pemilik},%20saya%20tertarik%20dengan%20produk%20${umkm.nama_usaha}%20Anda.`, "_blank");
  };

  const showUmkm = activeTab === "semua" || activeTab === "umkm";
  const showWisata = activeTab === "semua" || activeTab === "wisata";

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Potensi Wisata & UMKM Desa</h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Kunjungi keindahan alam Desa Tempursari dan dukung perekonomian lokal dengan membeli produk UMKM unggulan warga.
          </p>
        </div>
      </section>

      {/* Tab Controller */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xl shadow-slate-100/50 flex space-x-1">
            {[
              { id: "semua", label: "Tampilkan Semua" },
              { id: "umkm", label: "UMKM Unggulan", icon: ShoppingBag },
              { id: "wisata", label: "Objek Wisata", icon: Compass }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "bg-emerald-700 text-white shadow-md shadow-emerald-700/20"
                      : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gallery Showcase Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. UMKM Cards Rendering */}
          {showUmkm && umkmData.map((umkm) => (
            <div
              key={umkm.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col sm:flex-row group hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-50">
                <Image
                  src={umkm.foto_url}
                  alt={umkm.nama_usaha}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-amber-500 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                  UMKM Lokal
                </div>
              </div>

              {/* Text Description Box */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Pemilik: {umkm.pemilik}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                    {umkm.nama_usaha}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                    {umkm.deskripsi}
                  </p>
                  <div className="flex items-start space-x-1.5 pt-1.5 text-[10px] text-slate-400 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{umkm.alamat}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleWaContact(umkm)}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-md shadow-emerald-600/10"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Hubungi Pemilik (WA)</span>
                </button>
              </div>
            </div>
          ))}

          {/* 2. Wisata Cards Rendering */}
          {showWisata && wisataData.map((wisata) => (
            <div
              key={wisata.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col sm:flex-row group hover:border-emerald-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Banner */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-slate-50">
                <Image
                  src={wisata.foto_url}
                  alt={wisata.nama_wisata}
                  fill
                  className="object-cover group-hover:scale-103 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                  Objek Wisata
                </div>
              </div>

              {/* Text Description Box */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{wisata.lokasi}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                    {wisata.nama_wisata}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-medium">
                    {wisata.deskripsi}
                  </p>
                </div>

                <a
                  href={wisata.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Petunjuk Arah (Maps)</span>
                </a>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
