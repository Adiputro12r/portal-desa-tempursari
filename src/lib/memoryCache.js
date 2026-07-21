/**
 * Global in-memory cache object.
 * 
 * Karena Next.js menggunakan SPA routing di sisi client,
 * variabel memori ini tidak akan ter-reset saat user pindah-pindah halaman.
 * Ini memungkinkan kita untuk menginisialisasi state React secara sinkron (langsung ada data)
 * tanpa menimbulkan flicker/skeleton jika data sudah pernah di-fetch sebelumnya.
 */
export const memoryCache = {};
