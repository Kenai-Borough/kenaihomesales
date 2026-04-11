import { BadgeCheck } from 'lucide-react';

export function VerificationBadge({ label }: { label: string }) {
  return (
    <span className="badge-dark">
      <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> {label}
    </span>
  );
}
