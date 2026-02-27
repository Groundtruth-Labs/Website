export default function ProjectLoading() {
  return (
    <div className="animate-pulse">
      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="h-6 w-20 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="h-4 w-36 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-md p-1 w-fit">
        {["Overview", "Deliverables", "Reports"].map((t) => (
          <div key={t} className="h-8 w-24 bg-slate-200 rounded" />
        ))}
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status card */}
        <div className="border border-slate-200 bg-white rounded p-6">
          <div className="h-3 w-24 bg-slate-100 rounded mb-5" />
          <div className="flex items-center gap-0">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="h-3 w-12 bg-slate-100 rounded mt-2" />
                </div>
                {i < 2 && <div className="flex-1 h-0.5 mx-1 mt-[-20px] bg-slate-100" />}
              </div>
            ))}
          </div>
        </div>

        {/* Summary card */}
        <div className="border border-slate-200 bg-white rounded p-6">
          <div className="h-3 w-16 bg-slate-100 rounded mb-5" />
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="bg-slate-50 rounded p-4">
                <div className="h-8 w-8 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
