/**
 * UMKM & Wisata Page — Server Component.
 *
 * Fetch data UMKM dan Wisata dari Supabase di server secara paralel.
 * Pass ke UmkmWisataClient yang handle tab switching (butuh interaktivitas).
 * `force-dynamic` → render fresh setiap request, perubahan Supabase langsung tampil.
 */
export const dynamic = 'force-dynamic';

import { fetchUmkm, fetchWisata } from "@/lib/fetchData";
import UmkmWisataClient from "@/components/sections/UmkmWisataClient";

export const metadata = {
  title: "Potensi Wisata & UMKM - Portal Desa Tempursari",
  description: "Kunjungi keindahan alam dan dukung UMKM lokal Desa Tempursari.",
};

export default async function UmkmWisata() {
  // Fetch keduanya paralel — lebih cepat dari sequential
  const [umkmList, wisataList] = await Promise.all([
    fetchUmkm(),
    fetchWisata(),
  ]);

  return <UmkmWisataClient initialUmkm={umkmList} initialWisata={wisataList} />;
}
