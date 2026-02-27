export default function DashboardLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Greeting */}
      <div className="h-7 w-56 bg-slate-200 rounded mb-1" />
      <div className="h-4 w-40 bg-slate-100 rounded mb-8" />

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-slate-200 bg-white rounded p-5 space-y-3"
          >
            {/* Type badge + status badge */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-slate-100 rounded" />
              <div className="h-5 w-14 bg-slate-100 rounded" />
            </div>
            {/* Project name */}
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            {/* Location */}
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            {/* Divider */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-100 rounded" />
              <div className="h-6 w-16 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
