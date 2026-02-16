import { siteConfig } from '../lib/config';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">{siteConfig.name}</h3>
            <p className="text-gray-400 mb-4">{siteConfig.description}</p>
            <p className="text-gray-400">{siteConfig.address}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href={`tel:${siteConfig.phone}`} className="hover:text-white transition">
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
          
          {siteConfig.relatedSites.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">Related Sites</h4>
              <ul className="space-y-2 text-gray-400">
                {siteConfig.relatedSites.map((site) => (
                  <li key={site.url}>
                    <a href={site.url} className="hover:text-white transition" target="_blank" rel="noopener noreferrer">
                      {site.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
