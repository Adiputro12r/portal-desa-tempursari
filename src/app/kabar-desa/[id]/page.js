// Server Component — tidak ada "use client"
// Data artikel di-fetch di server sebelum HTML dikirim ke browser.
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticleById, getArticleRecommendations } from "@/lib/queries";
import DetailBeritaClient from "@/components/sections/DetailBeritaClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const artikel = await getArticleById(id);
  if (!artikel) {
    return {
      title: "Berita Tidak Ditemukan - Portal Desa Tempursari",
    };
  }
  return {
    title: `${artikel.judul} - Portal Desa Tempursari`,
    description: (artikel.konten || "").replace(/<[^>]*>/g, "").substring(0, 150),
  };
}

export default async function DetailBerita({ params }) {
  const { id } = await params;

  // Fetch data paralel di server
  const [artikel, recommendations] = await Promise.all([
    getArticleById(id),
    getArticleRecommendations(id),
  ]);

  if (!artikel) {
    return (
      <div className="pt-32 pb-20 text-center space-y-4 min-h-screen bg-slate-50">
        <h2 className="text-2xl font-extrabold text-slate-800">
          Berita Tidak Ditemukan
        </h2>
        <p className="text-sm text-slate-400">
          Maaf, artikel yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          href="/kabar-desa"
          className="inline-flex items-center space-x-2 text-emerald-700 font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Kabar Desa</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-slate-50 min-h-screen">
      {/*
        DetailBeritaClient: Client Component yang handle image gallery & share button.
        Data sudah di-fetch dari server.
      */}
      <DetailBeritaClient artikel={artikel} recommendations={recommendations} />
    </div>
  );
}
