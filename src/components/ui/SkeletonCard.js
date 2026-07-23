export default function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 animate-pulse space-y-4 flex flex-col justify-between"
        >
          <div className="bg-slate-200 h-48 rounded-xl w-full" />
          <div className="space-y-3">
            <div className="bg-slate-200 h-3.5 rounded-md w-1/3" />
            <div className="bg-slate-200 h-5 rounded-md w-4/5" />
            <div className="bg-slate-200 h-3.5 rounded-md w-full" />
            <div className="bg-slate-200 h-3.5 rounded-md w-2/3" />
          </div>
          <div className="bg-slate-200 h-8 rounded-xl w-1/2 pt-2" />
        </div>
      ))}
    </div>
  );
}
