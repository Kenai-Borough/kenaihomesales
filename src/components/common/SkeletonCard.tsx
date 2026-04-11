export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="h-48 rounded-[24px] bg-white/10" />
      <div className="mt-4 h-4 w-24 rounded-full bg-white/10" />
      <div className="mt-3 h-8 w-3/4 rounded-full bg-white/10" />
      <div className="mt-5 h-4 w-full rounded-full bg-white/10" />
      <div className="mt-3 h-4 w-5/6 rounded-full bg-white/10" />
    </div>
  );
}
