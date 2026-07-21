/**
 * fetchData.js — Centralized data fetcher untuk Server Components.
 *
 * Semua fungsi di sini berjalan di server (Node.js environment).
 * Tidak ada `useState`, `useEffect`, atau browser APIs di sini.
 * Setiap fungsi mengembalikan data asli dari Supabase, atau fallback
 * statis jika Supabase error / data kosong.
 */

import { supabaseServer } from "@/lib/supabaseServer";
import { aparatData as fallbackAparat } from "@/data/aparatData";
import { beritaData as fallbackBerita } from "@/data/beritaData";
import { umkmData as fallbackUmkm, wisataData as fallbackWisata } from "@/data/umkmWisataData";

// ─── Helper ─────────────────────────────────────────────────────────────────

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

// ─── Fetchers ────────────────────────────────────────────────────────────────

/**
 * Fetch semua aparat pemerintah desa dari Supabase.
 * Mengembalikan data yang sudah di-sort (Kades di depan).
 */
export async function fetchAparat() {
  try {
    const { data, error } = await supabaseServer
      .from("pemerintah_desa")
      .select("*");

    if (!error && data && data.length > 0) {
      return sortAparat(data);
    }
    return sortAparat(fallbackAparat);
  } catch (_) {
    return sortAparat(fallbackAparat);
  }
}

/**
 * Fetch artikel/berita dari Supabase.
 * @param {number|null} limit - Jumlah artikel. null = semua.
 * @param {boolean} includeContent - Apakah perlu menyertakan konten lengkap (default: false untuk menghemat ukuran cache)
 */
export async function fetchArtikel(limit = null, includeContent = false) {
  try {
    const fields = includeContent
      ? "*"
      : "id, judul, kategori, foto_url, tanggal, author, created_at";

    let query = supabaseServer
      .from("artikel")
      .select(fields)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data;
    }
    return limit ? fallbackBerita.slice(0, limit) : fallbackBerita;
  } catch (_) {
    return limit ? fallbackBerita.slice(0, limit) : fallbackBerita;
  }
}

/**
 * Fetch data kepala desa dari Supabase.
 * Mengembalikan object { nama, foto } atau fallback.
 */
export async function fetchKades() {
  try {
    const { data, error } = await supabaseServer
      .from("pemerintah_desa")
      .select("*")
      .ilike("jabatan", "%Kepala Desa%")
      .limit(1);

    if (!error && data && data.length > 0) {
      return {
        nama: data[0].nama || "Hajah aina",
        foto:
          data[0].foto_url ||
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
      };
    }
  } catch (_) {}

  return {
    nama: "Hajah aina",
    foto: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
  };
}

/**
 * Fetch data UMKM dari Supabase.
 */
export async function fetchUmkm() {
  try {
    const { data, error } = await supabaseServer
      .from("umkm")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) return data;
    return fallbackUmkm;
  } catch (_) {
    return fallbackUmkm;
  }
}

/**
 * Fetch data wisata dari Supabase.
 */
export async function fetchWisata() {
  try {
    const { data, error } = await supabaseServer
      .from("wisata")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) return data;
    return fallbackWisata;
  } catch (_) {
    return fallbackWisata;
  }
}
