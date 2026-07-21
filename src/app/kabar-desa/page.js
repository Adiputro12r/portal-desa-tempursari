/**
 * Kabar Desa Page — Server Component.
 *
 * Fetch semua artikel dari Supabase di server.
 * Pass data ke KabarDesaClient yang handle search & filter (butuh interaktivitas).
 * `force-dynamic` → render fresh setiap request, perubahan Supabase langsung tampil.
 */
export const dynamic = 'force-dynamic';

import { fetchArtikel } from "@/lib/fetchData";
import KabarDesaClient from "@/components/sections/KabarDesaClient";

export const metadata = {
  title: "Kabar Desa - Portal Desa Tempursari",
  description: "Berita terkini, pengumuman resmi, dan liputan kegiatan warga Desa Tempursari.",
};

export default async function KabarDesa() {
  const beritaList = await fetchArtikel();
  return <KabarDesaClient initialData={beritaList} />;
}
