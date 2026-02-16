import { siteConfig } from '../lib/config';

interface HeroProps {
  title?: string;
  subtitle?: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-alaska-blue to-alaska-blue-light text-white py-24">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {title || siteConfig.title}
        </h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-8">
          {subtitle || siteConfig.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#listings" 
            className="bg-white text-alaska-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Browse Listings
          </a>
          <a 
            href="#contact" 
            className="bg-alaska-green text-white px-8 py-3 rounded-lg font-semibold hover:bg-alaska-green-light transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
