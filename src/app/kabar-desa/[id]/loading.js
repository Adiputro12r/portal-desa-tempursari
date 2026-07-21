/**
 * loading.js — Detail Berita Loading Fallback
 *
 * Ditampilkan hanya saat server sedang fetch detail berita dari Supabase.
 */
export default function DetailBeritaLoading() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-slate-200 rounded w-48" />

        {/* Action bar skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-16" />
          <div className="h-8 bg-slate-200 rounded w-28" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 space-y-6">
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-20" />
              <div className="h-8 bg-slate-200 rounded w-3/4" />
            </div>
            <div className="h-[400px] bg-slate-200 rounded-2xl w-full" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-slate-100 rounded w-full" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 h-80" />
        </div>
      </div>
    </div>
  );
}
