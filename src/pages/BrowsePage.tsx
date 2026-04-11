import { useMemo, useState } from 'react';
import { Grid3X3, Map } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Seo } from '../components/common/Seo';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { HomeCard } from '../components/homes/HomeCard';
import { HomeMap } from '../components/homes/HomeMap';
import { homes } from '../data/homes';
import { useToast } from '../context/ToastContext';
import { loadHomeIds, saveHomeIds } from '../lib/utils';
import type { SearchFilters } from '../types';

const initialFilters: SearchFilters = {
  query: '',
  minPrice: 200000,
  maxPrice: 800000,
  bedrooms: 0,
  bathrooms: 0,
  minSqft: 0,
  city: 'all',
  propertyType: 'all',
  yearBuilt: 0,
};

export default function BrowsePage() {
  const { notify } = useToast();
  const [params] = useSearchParams();
  const [showMap, setShowMap] = useState(true);
  const [loading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ ...initialFilters, query: params.get('q') || '' });

  const filteredHomes = useMemo(
    () =>
      homes.filter((home) => {
        const matchesQuery = [home.title, home.city, home.description, home.propertyType].join(' ').toLowerCase().includes(filters.query.toLowerCase());
        const matchesPrice = home.price >= filters.minPrice && home.price <= filters.maxPrice;
        const matchesBeds = filters.bedrooms === 0 || home.bedrooms >= filters.bedrooms;
        const matchesBaths = filters.bathrooms === 0 || home.bathrooms >= filters.bathrooms;
        const matchesSqft = filters.minSqft === 0 || home.sqft >= filters.minSqft;
        const matchesCity = filters.city === 'all' || home.city === filters.city;
        const matchesType = filters.propertyType === 'all' || home.propertyType === filters.propertyType;
        const matchesYear = filters.yearBuilt === 0 || home.yearBuilt >= filters.yearBuilt;
        return matchesQuery && matchesPrice && matchesBeds && matchesBaths && matchesSqft && matchesCity && matchesType && matchesYear;
      }),
    [filters],
  );

  const saveHome = (id: string) => {
    const current = loadHomeIds();
    if (!current.includes(id)) {
      saveHomeIds([id, ...current]);
      notify('Saved to your buyer dashboard');
    }
  };

  return (
    <div className="section-shell">
      <Seo title="Browse Kenai Peninsula homes" description="Filter homes by price, bedrooms, bathrooms, square footage, city, type, and year built." path="/browse" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Browse homes</p>
            <h1 className="section-title">Find the right Kenai Peninsula home with filters, map pins, and buyer-ready detail pages.</h1>
          </div>
          <div className="flex gap-3">
            <button type="button" className={`icon-button ${!showMap ? 'border-cyan-300 text-cyan-200' : ''}`} onClick={() => setShowMap(false)}><Grid3X3 className="h-4 w-4" /></button>
            <button type="button" className={`icon-button ${showMap ? 'border-cyan-300 text-cyan-200' : ''}`} onClick={() => setShowMap(true)}><Map className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="mt-8 card-elevated">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input className="input-glass" placeholder="Search by city, feature, or type" value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} />
            <select className="select-glass" value={filters.city} onChange={(event) => setFilters((current) => ({ ...current, city: event.target.value }))}>
              <option value="all">All cities</option>
              {['Kenai', 'Soldotna', 'Homer', 'Seward', 'Sterling', 'Cooper Landing', 'Nikiski', 'Anchor Point'].map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select className="select-glass" value={filters.propertyType} onChange={(event) => setFilters((current) => ({ ...current, propertyType: event.target.value as SearchFilters['propertyType'] }))}>
              <option value="all">All property types</option>
              <option value="single_family">Single family</option>
              <option value="cabin">Cabin</option>
              <option value="manufactured">Manufactured</option>
              <option value="multi_family">Multi-family</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input className="input-glass" type="number" min="200000" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: Number(event.target.value || 0) }))} placeholder="Min price" />
              <input className="input-glass" type="number" min="200000" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Number(event.target.value || 0) }))} placeholder="Max price" />
            </div>
            <input className="input-glass" type="number" min="0" value={filters.bedrooms} onChange={(event) => setFilters((current) => ({ ...current, bedrooms: Number(event.target.value || 0) }))} placeholder="Bedrooms" />
            <input className="input-glass" type="number" min="0" value={filters.bathrooms} onChange={(event) => setFilters((current) => ({ ...current, bathrooms: Number(event.target.value || 0) }))} placeholder="Bathrooms" />
            <input className="input-glass" type="number" min="0" value={filters.minSqft} onChange={(event) => setFilters((current) => ({ ...current, minSqft: Number(event.target.value || 0) }))} placeholder="Min sqft" />
            <input className="input-glass" type="number" min="0" value={filters.yearBuilt} onChange={(event) => setFilters((current) => ({ ...current, yearBuilt: Number(event.target.value || 0) }))} placeholder="Year built after" />
          </div>
        </div>

        <div className={`mt-8 grid gap-8 ${showMap ? 'xl:grid-cols-[1.1fr_0.9fr]' : ''}`}>
          <div>
            <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-300">
              <span>{filteredHomes.length} homes match your filters.</span>
              <button type="button" className="text-cyan-300" onClick={() => setFilters({ ...initialFilters, query: filters.query })}>Reset filters</button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
                : filteredHomes.map((home) => <HomeCard key={home.id} home={home} onSave={saveHome} />)}
            </div>
          </div>
          {showMap && (
            <div className="xl:sticky xl:top-24 xl:h-fit">
              <HomeMap homes={filteredHomes} height="760px" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
