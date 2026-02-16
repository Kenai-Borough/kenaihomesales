import type { Listing } from '../types';

export const sampleListings: Listing[] = [
  {
    id: '1',
    title: 'Beautiful Waterfront Home',
    price: 425000,
    location: 'Kenai, AK',
    description: 'Stunning 3-bedroom home with panoramic views of the Kenai River',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    type: 'home',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    features: ['Waterfront', 'Updated Kitchen', 'Garage']
  },
  {
    id: '2',
    title: '40 Acres with Mountain Views',
    price: 185000,
    location: 'Soldotna, AK',
    description: 'Prime acreage perfect for development or private retreat',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    type: 'land',
    acres: 40,
    features: ['Mountain Views', 'Road Access', 'Trees']
  },
  {
    id: '3',
    title: 'Downtown Commercial Building',
    price: 650000,
    location: 'Homer, AK',
    description: 'Prime commercial property in downtown Homer',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    type: 'commercial',
    sqft: 4500,
    features: ['High Traffic', 'Parking', 'Updated']
  },
  {
    id: '4',
    title: 'Cozy 2BR Cabin',
    price: 1800,
    location: 'Kenai, AK',
    description: 'Charming cabin available for long-term rental',
    image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
    type: 'rental',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1200,
    features: ['Furnished', 'Utilities Included', 'Pet Friendly']
  },
  {
    id: '5',
    title: '2019 Ford F-150',
    price: 38500,
    location: 'Soldotna, AK',
    description: 'Excellent condition, low miles, 4WD',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    type: 'vehicle',
    year: 2019,
    features: ['4WD', 'Low Miles', 'One Owner']
  },
  {
    id: '6',
    title: 'Residential Lot',
    price: 75000,
    location: 'Sterling, AK',
    description: 'Build your dream home on this cleared lot',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
    type: 'lot',
    acres: 2.5,
    features: ['Cleared', 'Utilities Available', 'Quiet Area']
  }
];
