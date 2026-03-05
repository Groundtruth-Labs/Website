export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-slate-200" />
          <div className="w-32 h-3.5 rounded bg-slate-200" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="w-16 h-3 rounded bg-slate-200" />
          <div className="w-20 h-3 rounded bg-slate-200" />
          <div className="w-14 h-3 rounded bg-slate-200" />
          <div className="w-28 h-8 rounded bg-slate-200" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center gap-6">
        <div className="w-24 h-3 rounded bg-slate-200" />
        <div className="w-3/4 h-10 rounded bg-slate-200" />
        <div className="w-1/2 h-10 rounded bg-slate-200" />
        <div className="flex flex-col items-center gap-2 w-full mt-2">
          <div className="w-96 h-4 rounded bg-slate-200" />
          <div className="w-72 h-4 rounded bg-slate-200" />
        </div>
        <div className="flex gap-3 mt-4">
          <div className="w-40 h-10 rounded bg-slate-200" />
          <div className="w-36 h-10 rounded bg-slate-200" />
        </div>
      </div>

      {/* Content cards skeleton */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded p-6 flex flex-col gap-4"
            >
              <div className="w-8 h-8 rounded bg-slate-200" />
              <div className="w-3/4 h-4 rounded bg-slate-200" />
              <div className="flex flex-col gap-2">
                <div className="w-full h-3 rounded bg-slate-200" />
                <div className="w-5/6 h-3 rounded bg-slate-200" />
                <div className="w-4/6 h-3 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
