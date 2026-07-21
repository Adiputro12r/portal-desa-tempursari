"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Phone, MessageSquare } from "lucide-react";
import ModalPhone from "@/components/ui/ModalPhone";

/**
 * AparatSlider — Client Component (slider interaktif + modal kontak)
 *
 * Data aparat di-fetch oleh Server Component parent (page.js / layout)
 * dan dikirim ke sini sebagai prop `initialData`.
 * Komponen ini TIDAK melakukan fetch apapun.
 */
export default function AparatSlider({ initialData = [] }) {
  const scrollContainerRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAparat, setSelectedAparat] = useState(null);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  const handleContactClick = (aparat) => {
    if (aparat.hasWhatsapp) {
      const cleanPhone = aparat.kontak.replace("+", "");
      window.open(
        `https://wa.me/${cleanPhone}?text=Halo%20Pak/Bu%20${aparat.nama},%20saya%20ingin%20bertanya%20mengenai%20layanan%20desa.`,
        "_blank"
      );
    } else {
      setSelectedAparat(aparat);
      setModalOpen(true);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-widest block">
              Pemerintah Desa
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Aparat Pemerintah Desa Tempursari
            </h2>
            <p className="text-slate-500 text-sm max-w-xl">
              Siap melayani masyarakat desa dengan integritas, transparansi, dan
              dedikasi penuh demi kemajuan Desa Tempursari.
            </p>
          </div>

          {/* Custom Navigation Arrows */}
          <div className="flex items-center space-x-3 mt-6 md:mt-0">
            <button
              onClick={scrollLeft}
              aria-label="Geser kiri"
              className="p-3 bg-white hover:bg-emerald-600 hover:text-white rounded-full shadow-md text-slate-600 transition-all border border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Geser kanan"
              className="p-3 bg-white hover:bg-emerald-600 hover:text-white rounded-full shadow-md text-slate-600 transition-all border border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth px-1"
        >
          {initialData.map((aparat) => (
            <div
              key={aparat.id}
              className="flex-shrink-0 w-[290px] sm:w-[310px] bg-white rounded-2xl shadow-xl shadow-slate-100/50 border border-slate-100 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-950/5 transition-all duration-300 snap-start flex flex-col justify-between group overflow-hidden"
            >
              {/* Photo Cover Section */}
              <div className="relative h-72 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={aparat.foto}
                  alt={aparat.nama}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
              </div>

              {/* Text Info */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 tracking-widest uppercase block">
                    {aparat.jabatan}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-800 tracking-tight leading-snug group-hover:text-emerald-800 transition-colors">
                    {aparat.nama}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1.5 font-medium">
                    {aparat.deskripsi}
                  </p>
                </div>

                {/* Contact Action Button */}
                <button
                  onClick={() => handleContactClick(aparat)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2.5 transition-all shadow-md ${
                    aparat.hasWhatsapp
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20"
                      : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20"
                  }`}
                >
                  {aparat.hasWhatsapp ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      <span>Hubungi Telepon</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Phone Modal */}
      {selectedAparat && (
        <ModalPhone
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          name={selectedAparat.nama}
          role={selectedAparat.jabatan}
          phoneNumber={selectedAparat.kontak}
        />
      )}
    </section>
  );
}
