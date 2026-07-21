/**
 * loading.js — Home Page Loading Fallback
 *
 * Ditampilkan oleh Next.js HANYA saat server sedang fetch data dari Supabase
 * untuk pertama kali (cold start). Biasanya hanya terlihat < 500ms.
 * Ini bukan skeleton dummy — ini fallback nyata berbasis Suspense.
 */
export default function HomeLoading() {
  return (
    <div className="space-y-0 animate-pulse">
      {/* Hero Placeholder */}
      <div className="h-[600px] bg-gradient-to-br from-emerald-900 to-green-800" />

      {/* Stats Bar */}
      <div className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center space-x-4 p-2">
              <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-2.5 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kades Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-72 h-80 bg-slate-200 rounded-3xl" />
              <div className="mt-4 space-y-2 text-center">
                <div className="h-5 bg-slate-200 rounded w-36 mx-auto" />
                <div className="h-3 bg-slate-100 rounded w-28 mx-auto" />
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="h-3 bg-slate-200 rounded w-24" />
              <div className="h-10 bg-slate-200 rounded w-full" />
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="w-16 h-1 bg-amber-200 rounded" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
