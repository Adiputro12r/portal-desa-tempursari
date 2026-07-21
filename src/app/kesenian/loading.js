/**
 * loading.js — Kesenian Page Loading Fallback
 *
 * Ditampilkan hanya saat server sedang fetch data kesenian dari Supabase.
 */
export default function KesenianLoading() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen animate-pulse">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-800 rounded-full mx-auto" />
          <div className="h-10 bg-emerald-800 rounded w-72 mx-auto" />
          <div className="h-4 bg-emerald-800 rounded w-80 mx-auto" />
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4 mb-16">
        <div className="h-4 bg-slate-200 rounded w-24 mx-auto" />
        <div className="h-8 bg-slate-200 rounded w-64 mx-auto" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-5/6 mx-auto" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="h-64 sm:h-72 bg-slate-200" />
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-12 bg-slate-200 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
