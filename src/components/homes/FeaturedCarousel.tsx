import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Home } from '../../types';
import { HomeCard } from './HomeCard';

export function FeaturedCarousel({ homes, onSave }: { homes: Home[]; onSave: (id: string) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="section-eyebrow">Featured homes</p>
          <h2 className="section-title">Move-in-ready homes, cabins, and investment opportunities.</h2>
        </div>
        <div className="hidden gap-3 sm:flex">
          <button className="icon-button" type="button" onClick={() => emblaApi?.scrollPrev()} aria-label="Previous featured home"><ChevronLeft className="h-4 w-4" /></button>
          <button className="icon-button" type="button" onClick={() => emblaApi?.scrollNext()} aria-label="Next featured home"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {homes.map((home) => (
            <div key={home.id} className="min-w-0 flex-[0_0_88%] md:flex-[0_0_55%] xl:flex-[0_0_38%]">
              <HomeCard home={home} onSave={onSave} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
