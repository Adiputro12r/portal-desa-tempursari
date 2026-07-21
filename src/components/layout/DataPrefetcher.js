"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { memoryCache } from "@/lib/memoryCache";

// TTL untuk localStorage — sama dengan di server (60 detik)
const CACHE_TTL = 60 * 1000;

const TASKS = [
  {
    key: "aparat_desa_cache_v2",
    fetch: () => supabase.from("pemerintah_desa").select("*"),
    transform: (data) =>
      [...data]
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
            item.hasWhatsapp ??
            (item.kontak ? item.kontak.startsWith("+") : true),
        })),
  },
  {
    key: "kabar_desa_list_cache",
    fetch: () =>
      supabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false }),
  },
  {
    key: "recent_articles",
    fetch: () =>
      supabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3),
  },
  {
    key: "umkm_list_cache",
    fetch: () =>
      supabase
        .from("umkm")
        .select("*")
        .order("created_at", { ascending: false }),
  },
  {
    key: "wisata_list_cache",
    fetch: () =>
      supabase
        .from("wisata")
        .select("*")
        .order("created_at", { ascending: false }),
  },
];

/**
 * DataPrefetcher — komponen tak-terlihat di layout root.
 *
 * Berjalan di background saat app pertama kali dibuka.
 * Fetch semua data Supabase dan simpan ke memoryCache + localStorage.
 *
 * Ketika user navigasi ke halaman lain (Kabar Desa, UMKM, dst.),
 * data sudah tersedia di cache — tidak perlu loading lagi.
 *
 * Tidak render apapun ke UI.
 */
export default function DataPrefetcher() {
  useEffect(() => {
    // Jalankan semua prefetch setelah halaman pertama selesai render
    // Delay kecil agar tidak berebut bandwidth dengan request halaman utama
    const timer = setTimeout(() => {
      prefetchAll();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

async function prefetchAll() {
  // Cek apakah semua key sudah ada dan masih fresh di localStorage
  const allFresh = TASKS.every((task) => {
    if (memoryCache[task.key]) return true; // sudah di memory, skip
    try {
      const cached = localStorage.getItem(task.key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (data?.length > 0 && Date.now() - timestamp < CACHE_TTL) {
          // Masukkan ke memoryCache agar komponen lain bisa pakai
          memoryCache[task.key] = data;
          return true;
        }
      }
    } catch (_) {}
    return false;
  });

  if (allFresh) return; // semua data sudah fresh, tidak perlu fetch

  // Fetch semua tabel secara paralel
  await Promise.allSettled(
    TASKS.map(async (task) => {
      // Skip kalau sudah ada di memory
      if (memoryCache[task.key]) return;

      try {
        const { data, error } = await task.fetch();
        if (!error && data && data.length > 0) {
          const transformed = task.transform ? task.transform(data) : data;
          memoryCache[task.key] = transformed;
          localStorage.setItem(
            task.key,
            JSON.stringify({ data: transformed, timestamp: Date.now() })
          );
        }
      } catch (_) {
        // Prefetch gagal = tidak masalah, halaman akan fetch sendiri jika perlu
      }
    })
  );
}
