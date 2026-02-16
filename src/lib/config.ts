import type { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  name: 'Kenai Home Sales',
  title: 'Kenai Home Sales - Residential Real Estate Experts',
  description: 'Your trusted source for residential home sales on the Kenai Peninsula. Single-family homes, condos, and more',
  url: 'https://kenaihomesales.com',
  ogImage: '/og-image.jpg',
  phone: '(907) 555-0105',
  email: 'homes@kenaihomesales.com',
  address: 'Kenai Peninsula, Alaska',
  businessType: 'RealEstateAgent',
  primaryColor: '#0066cc',
  relatedSites: [
    { name: 'Kenai Borough', url: 'https://kenaiborough.com', description: 'Official Kenai Peninsula Borough portal' },
    { name: 'Kenai Borough Realty', url: 'https://kenaiboroughrealty.com', description: 'Full-service real estate for homes, land, and commercial properties' },
    { name: 'Kenai Peninsula Rentals', url: 'https://kenaipeninsularentals.com', description: 'Long-term and short-term rental listings' },
    { name: 'Kenai Land Sales', url: 'https://kenailandsales.com', description: 'Acreage, lots, and development opportunities' },
    { name: 'Kenai Auto Sales', url: 'https://kenaiautosales.com', description: 'Quality vehicles for Alaska living' }
  ],
  listingTypes: ['home']
};
