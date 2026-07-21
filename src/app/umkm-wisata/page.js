// Server Component — tidak ada "use client"
// Data UMKM + Wisata di-fetch paralel di server, dikirim ke UmkmWisataClient.
export const dynamic = "force-dynamic";

import { ShoppingBag } from "lucide-react";
import { getUmkmList, getWisataList } from "@/lib/queries";
import UmkmWisataClient from "@/components/sections/UmkmWisataClient";

export const metadata = {
  title: "Potensi Wisata & UMKM - Portal Desa Tempursari",
  description:
    "Kunjungi keindahan alam Desa Tempursari dan dukung perekonomian lokal melalui UMKM unggulan warga desa.",
};

export default async function UmkmWisata() {
  // Fetch paralel — kedua query jalan bersamaan, tidak menunggu satu per satu
  const [umkmList, wisataList] = await Promise.all([
    getUmkmList(),
    getWisataList(),
  ]);

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 text-white mb-12 shadow-md relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('/assets/kesenian-placeholder.svg')" }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Potensi Wisata &amp; UMKM Desa
          </h1>
          <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base font-medium">
            Kunjungi keindahan alam Desa Tempursari dan dukung perekonomian
            lokal.
          </p>
        </div>
      </section>

      {/*
        UmkmWisataClient: Client Component yang handle tabs switching.
        Data sudah di-fetch dari server, tabs ganti di client tanpa request baru.
      */}
      <UmkmWisataClient umkmList={umkmList} wisataList={wisataList} />
    </div>
  );
}
