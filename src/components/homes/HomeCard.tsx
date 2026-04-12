import { motion } from 'framer-motion';
import { Bath, Bed, Heart, MapPin, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Home } from '../../types';
import { currency, propertyTypeLabel } from '../../lib/utils';
import { VerificationBadge } from './VerificationBadge';

interface HomeCardProps {
  home: Home;
  onSave?: (id: string) => void;
}

export function HomeCard({ home, onSave }: HomeCardProps) {
  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} whileHover={{ y: -8 }} className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/75 shadow-xl shadow-slate-950/20">
      <div className="relative h-60 overflow-hidden">
        <img alt={home.title} loading="lazy" width="1400" height="900" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={home.images[0]} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {home.verifiedSeller && <VerificationBadge label={home.badge} />}
        </div>
        {onSave && (
          <button type="button" className="icon-button absolute right-4 top-4" onClick={() => onSave(home.id)} aria-label={`Save ${home.title}`}>
            <Heart className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{propertyTypeLabel(home.propertyType)}</p>
            <Link className="mt-2 block text-xl font-semibold text-white group-hover:text-cyan-300" to={`/home/${home.id}`}>
              {home.title}
            </Link>
          </div>
        </div>
        <p className="text-3xl font-semibold text-white">{currency(home.price)}</p>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 text-cyan-300" /> {home.city}, {home.state}
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 text-sm text-slate-200">
          <span className="inline-flex items-center gap-2"><Bed className="h-4 w-4 text-cyan-300" /> {home.bedrooms}</span>
          <span className="inline-flex items-center gap-2"><Bath className="h-4 w-4 text-cyan-300" /> {home.bathrooms}</span>
          <span className="inline-flex items-center gap-2"><Square className="h-4 w-4 text-cyan-300" /> {home.sqft.toLocaleString()}</span>
        </div>
        <p className="h-12 overflow-hidden text-sm leading-6 text-slate-300">{home.description}</p>
      </div>
    </motion.article>
  );
}
