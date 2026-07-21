import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useMaxLoading — shimmer berhenti setelah `maxMs` milidetik,
 * atau lebih cepat jika data sudah tiba.
 *
 * Cara pakai:
 *   const [loading, stopLoading] = useMaxLoading(1000);
 *
 *   async function fetchData() {
 *     try { ... } finally { stopLoading(); }
 *   }
 *
 * - Jika fetch selesai SEBELUM maxMs → shimmer langsung hilang.
 * - Jika fetch LEBIH DARI maxMs → shimmer paksa hilang setelah maxMs
 *   (tampilkan fallback data yang sudah ada).
 */
export function useMaxLoading(maxMs = 1000) {
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const stopLoading = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(false);
  }, []);

  // Auto-stop paksa setelah maxMs dari mount
  useEffect(() => {
    timerRef.current = setTimeout(() => setLoading(false), maxMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [maxMs]);

  return [loading, stopLoading];
}
