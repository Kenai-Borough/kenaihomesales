import { siteConfig } from '../lib/config';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-alaska-blue">{siteConfig.name}</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#listings" className="text-gray-700 hover:text-alaska-blue transition">Listings</a>
            <a href="#about" className="text-gray-700 hover:text-alaska-blue transition">About</a>
            <a href="#contact" className="text-gray-700 hover:text-alaska-blue transition">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href={`tel:${siteConfig.phone}`} className="text-sm text-alaska-blue hover:text-alaska-blue-light">
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
