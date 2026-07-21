/**
 * Server-side Supabase query functions.
 *
 * Semua fungsi ini dipanggil dari Server Components (async page/component).
 * Jika query gagal, fungsi akan throw error sehingga Next.js menampilkan
 * halaman error.js terdekat secara otomatis.
 *
 * PENTING: Jangan import file ini di Client Components ("use client").
 */

import { createClient } from "@supabase/supabase-js";

// Buat instance Supabase untuk server — aman karena tidak masuk ke client bundle
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables tidak ditemukan. Periksa .env.local."
    );
  }

  return createClient(url, key);
}

// ---------------------------------------------------------------------------
// Helper: sort aparat — Kepala Desa selalu di urutan pertama
// ---------------------------------------------------------------------------
function sortAparat(data) {
  return [...data]
    .sort((a, b) => {
      const isKadesA =
        a.jabatan?.toLowerCase().includes("kepala desa") ||
        a.jabatan?.toLowerCase() === "kades";
      const isKadesB =
        b.jabatan?.toLowerCase().includes("kepala desa") ||
        b.jabatan?.toLowerCase() === "kades";
      if (isKadesA && !isKadesB) return -1;
      if (!isKadesA && isKadesB) return 1;
      return (a.urutan ?? 0) - (b.urutan ?? 0);
    })
    .map((item) => ({
      ...item,
      foto: item.foto_url || item.foto || "/assets/avatar-kades.svg",
      hasWhatsapp:
        item.hasWhatsapp ?? (item.kontak ? item.kontak.startsWith("+") : true),
    }));
}

// ---------------------------------------------------------------------------
// Aparat Desa (Pemerintah Desa)
// ---------------------------------------------------------------------------
export async function getAparat() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase.from("pemerintah_desa").select("*");

  if (error) throw new Error(`Gagal memuat data aparat: ${error.message}`);
  if (!data || data.length === 0) return [];

  return sortAparat(data);
}

// ---------------------------------------------------------------------------
// Kepala Desa Info (untuk sambutan di home)
// ---------------------------------------------------------------------------
export async function getKadesInfo() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("pemerintah_desa")
    .select("nama, foto_url")
    .ilike("jabatan", "%Kepala Desa%")
    .limit(1);

  if (error) throw new Error(`Gagal memuat info Kepala Desa: ${error.message}`);

  if (data && data.length > 0) {
    return {
      nama: data[0].nama || "Kepala Desa",
      foto: data[0].foto_url || "/assets/avatar-kades.svg",
    };
  }

  return { nama: "Kepala Desa", foto: "/assets/avatar-kades.svg" };
}

// ---------------------------------------------------------------------------
// Artikel / Berita — 3 terbaru (untuk home)
// ---------------------------------------------------------------------------
export async function getRecentArticles() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(`Gagal memuat artikel: ${error.message}`);

  return data || [];
}

// ---------------------------------------------------------------------------
// Semua Artikel / Berita (untuk halaman kabar-desa)
// ---------------------------------------------------------------------------
export async function getAllArticles() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Gagal memuat semua artikel: ${error.message}`);

  return data || [];
}

// ---------------------------------------------------------------------------
// UMKM List
// ---------------------------------------------------------------------------
export async function getUmkmList() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("umkm")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Gagal memuat data UMKM: ${error.message}`);

  return data || [];
}

// ---------------------------------------------------------------------------
// Wisata List
// ---------------------------------------------------------------------------
export async function getWisataList() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("objek_wisata")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Gagal memuat data wisata: ${error.message}`);

  return data || [];
}

// ---------------------------------------------------------------------------
// Detail Artikel & Rekomendasi
// ---------------------------------------------------------------------------
export async function getArticleById(id) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Gagal memuat detail artikel: ${error.message}`);
  return data;
}

export async function getArticleRecommendations(excludeId) {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("artikel")
    .select("*")
    .neq("id", excludeId)
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(`Gagal memuat rekomendasi artikel: ${error.message}`);
  return data || [];
}

// ---------------------------------------------------------------------------
// Kesenian List
// ---------------------------------------------------------------------------
export async function getKesenianList() {
  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("kesenian_daerah")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Gagal memuat data kesenian: ${error.message}`);
  return data || [];
}
