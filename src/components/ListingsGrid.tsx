import { useState } from 'react';
import type { Listing } from '../types';
import { ListingCard } from './ListingCard';

interface ListingsGridProps {
  listings: Listing[];
  showFilters?: boolean;
}

export function ListingsGrid({ listings, showFilters = true }: ListingsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || listing.type === selectedType;
    
    let matchesPrice = true;
    if (priceRange === 'under100k') matchesPrice = listing.price < 100000;
    else if (priceRange === '100k-300k') matchesPrice = listing.price >= 100000 && listing.price < 300000;
    else if (priceRange === '300k-500k') matchesPrice = listing.price >= 300000 && listing.price < 500000;
    else if (priceRange === 'over500k') matchesPrice = listing.price >= 500000;
    
    return matchesSearch && matchesType && matchesPrice;
  });

  const types = Array.from(new Set(listings.map(l => l.type)));

  return (
    <div id="listings" className="py-12">
      {showFilters && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-alaska-blue focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="under100k">Under $100k</option>
                <option value="100k-300k">$100k - $300k</option>
                <option value="300k-500k">$300k - $500k</option>
                <option value="over500k">Over $500k</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 text-gray-600">
        {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No listings found matching your criteria.
        </div>
      )}
    </div>
  );
}
