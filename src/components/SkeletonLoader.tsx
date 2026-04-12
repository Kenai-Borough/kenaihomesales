type SkeletonVariant = 'card' | 'list' | 'detail';

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

const skeletonClass = 'animate-pulse rounded-2xl bg-white/10';

export function SkeletonLoader({ variant = 'card', count = 3, className = '' }: SkeletonLoaderProps) {
  if (variant === 'detail') {
    return (
      <div className={`grid gap-6 lg:grid-cols-[1.1fr_0.9fr] ${className}`}>
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className={`${skeletonClass} h-4 w-36`} />
          <div className={`${skeletonClass} h-14 w-full max-w-2xl`} />
          <div className={`${skeletonClass} h-5 w-full`} />
          <div className={`${skeletonClass} h-5 w-5/6`} />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${skeletonClass} h-20`} />
            ))}
          </div>
        </div>
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className={`${skeletonClass} h-72 w-full`} />
          <div className={`${skeletonClass} h-5 w-1/2`} />
          <div className={`${skeletonClass} h-5 w-3/4`} />
          <div className={`${skeletonClass} h-12 w-40`} />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className={`${skeletonClass} h-24 w-24 flex-none`} />
            <div className="flex-1 space-y-3">
              <div className={`${skeletonClass} h-4 w-32`} />
              <div className={`${skeletonClass} h-6 w-3/4`} />
              <div className={`${skeletonClass} h-4 w-full`} />
              <div className={`${skeletonClass} h-4 w-2/3`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 md:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className={`${skeletonClass} h-56 w-full rounded-none`} />
          <div className="space-y-3 p-5">
            <div className={`${skeletonClass} h-4 w-28`} />
            <div className={`${skeletonClass} h-6 w-3/4`} />
            <div className={`${skeletonClass} h-4 w-full`} />
            <div className={`${skeletonClass} h-4 w-5/6`} />
          </div>
        </div>
      ))}
    </div>
  );
}
