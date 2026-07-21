import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useMinLoading — shimmer tampil minimal `minMs` milidetik.
 *
 * Cara pakai:
 *   const [loading, startLoading, stopLoading] = useMinLoading(1000);
 *
 *   async function fetchData() {
 *     startLoading();
 *     try { ... } finally { stopLoading(); }
 *   }
 *
 * - Jika fetch selesai SEBELUM minMs → shimmer tetap tampil sampai minMs habis.
 * - Jika fetch selesai SETELAH minMs → shimmer langsung hilang.
 */
export function useMinLoading(minMs = 1000) {
  const [loading, setLoading] = useState(true);
  const startRef = useRef(null);
  const fetchDoneRef = useRef(false);
  const timerRef = useRef(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    fetchDoneRef.current = false;
    startRef.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const stopLoading = useCallback(() => {
    fetchDoneRef.current = true;
    const elapsed = Date.now() - (startRef.current ?? Date.now());
    const remaining = Math.max(0, minMs - elapsed);
    timerRef.current = setTimeout(() => setLoading(false), remaining);
  }, [minMs]);

  // Auto-start saat mount (untuk fetch di useEffect awal)
  useEffect(() => {
    startRef.current = Date.now();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return [loading, startLoading, stopLoading];
}
