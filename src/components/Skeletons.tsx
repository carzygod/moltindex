export const ToolCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 p-5">
    <div className="h-6 w-40 rounded bg-slate-800" />
    <div className="mt-2 h-4 w-24 rounded bg-slate-800" />
    <div className="mt-4 h-3 w-full rounded bg-slate-800" />
    <div className="mt-3 flex gap-2">
      <span className="h-6 w-16 rounded-full bg-slate-800" />
      <span className="h-6 w-20 rounded-full bg-slate-800" />
    </div>
    <div className="mt-4 flex items-center justify-between">
      <span className="h-3 w-12 rounded bg-slate-800" />
      <span className="h-3 w-20 rounded bg-slate-800" />
    </div>
  </div>
);

export const SectionSkeleton = () => (
  <div className="space-y-3">
    <div className="h-5 w-32 rounded bg-slate-800" />
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {[1, 2, 3].map((id) => (
        <div key={id} className="h-24 rounded-2xl bg-slate-900/60" />
      ))}
    </div>
  </div>
);
