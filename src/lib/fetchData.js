/**
 * fetchData.js — Centralized data fetcher untuk Server Components.
 *
 * Semua fungsi di sini berjalan di server (Node.js environment).
 * Setiap fungsi mengembalikan data asli dari Supabase, atau fallback
 * statis jika Supabase error / data kosong.
 */

import { supabaseServer } from "@/lib/supabaseServer";
import { aparatData as fallbackAparat } from "@/data/aparatData";
import { beritaData as fallbackBerita } from "@/data/beritaData";
import { umkmData as fallbackUmkm, wisataData as fallbackWisata } from "@/data/umkmWisataData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function parseFirstImage(foto_url, fallback = "/assets/kesenian-placeholder.svg") {
  if (!foto_url) return fallback;
  try {
    const arr = JSON.parse(foto_url);
    if (Array.isArray(arr) && arr.length > 0) return arr[0];
  } catch (_) {}
  return foto_url;
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
 * @param {boolean} includeContent - Apakah perlu menyertakan konten lengkap
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
      return data.map((item) => ({
        ...item,
        foto_url: parseFirstImage(item.foto_url),
      }));
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
  const fallbackFoto = "/assets/avatar-kades.svg";
  try {
    const { data, error } = await supabaseServer
      .from("pemerintah_desa")
      .select("*")
      .ilike("jabatan", "%Kepala Desa%")
      .limit(1);

    if (!error && data && data.length > 0) {
      const kades = data[0];
      return {
        nama: kades.nama || "Surip Al Suripto",
        foto: parseFirstImage(kades.foto_url || kades.foto, fallbackFoto),
      };
    }
  } catch (_) {}

  return {
    nama: "Surip Al Suripto",
    foto: fallbackFoto,
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
