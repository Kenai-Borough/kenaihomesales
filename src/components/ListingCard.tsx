import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const formatPrice = (price: number) => {
    if (listing.type === 'rental') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img 
        src={listing.image} 
        alt={listing.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
          <span className="text-xl font-bold text-alaska-blue">{formatPrice(listing.price)}</span>
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
        <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.bedrooms && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.bedrooms} BD</span>
          )}
          {listing.bathrooms && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.bathrooms} BA</span>
          )}
          {listing.sqft && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.sqft.toLocaleString()} sqft</span>
          )}
          {listing.acres && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.acres} acres</span>
          )}
          {listing.year && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.year}</span>
          )}
        </div>
        
        {listing.features && (
          <div className="flex flex-wrap gap-1 mb-4">
            {listing.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="text-xs text-alaska-blue bg-blue-50 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        <button className="w-full bg-alaska-blue text-white py-2 rounded hover:bg-alaska-blue-light transition">
          View Details
        </button>
      </div>
    </div>
  );
}
