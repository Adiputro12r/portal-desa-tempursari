/**
 * loading.js — UMKM Wisata Loading Fallback
 *
 * Ditampilkan hanya saat server fetch UMKM + Wisata dari Supabase (cold start).
 */
export default function UmkmWisataLoading() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-green-800 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-700 rounded-full mx-auto" />
          <div className="h-10 bg-emerald-800 rounded w-72 mx-auto" />
          <div className="h-4 bg-emerald-800 rounded w-80 mx-auto" />
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-center">
        <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xl flex space-x-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-32 h-10 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-48 h-48 bg-slate-200 shrink-0" />
              <div className="p-6 flex-grow space-y-3">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-9 bg-slate-200 rounded-xl mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
