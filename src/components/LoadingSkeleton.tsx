import { useLocation } from 'react-router-dom';
import { SkeletonLoader } from './SkeletonLoader';

export function LoadingSkeleton() {
  const { pathname } = useLocation();

  const variant = pathname === '/' || pathname.includes('/home/')
    ? 'detail'
    : pathname.includes('browse') || pathname.includes('sell')
      ? 'card'
      : 'list';

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <div className="h-4 w-36 animate-pulse rounded-full bg-white/10" />
        <div className="h-10 w-full max-w-2xl animate-pulse rounded-2xl bg-white/10" />
      </div>
      <SkeletonLoader variant={variant} count={variant === 'list' ? 4 : 6} />
    </div>
  );
}
