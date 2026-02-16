import { siteConfig } from '../lib/config';

export function RelatedSites() {
  if (siteConfig.relatedSites.length === 0) return null;

  return (
    <div className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Explore More Kenai Peninsula Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.relatedSites.map((site) => (
            <a
              key={site.url}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-alaska-blue mb-2">
                {site.name}
              </h3>
              <p className="text-gray-600">{site.description}</p>
              <div className="mt-4 text-alaska-blue-light font-medium">
                Visit Site →
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
