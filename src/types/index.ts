export type UserRole = 'buyer' | 'seller' | 'admin';
export type PropertyType = 'single_family' | 'cabin' | 'manufactured' | 'multi_family' | 'townhouse';

export interface PricePoint {
  date: string;
  price: number;
  label: string;
}

export interface Home {
  id: string;
  title: string;
  slug: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  propertyType: PropertyType;
  status: 'active' | 'pending' | 'sold';
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  stories: number;
  garageSpaces: number;
  parkingSpaces: number;
  hoaFee: number;
  taxes: number;
  heating: string;
  cooling: string;
  sewer: string;
  water: string;
  view: string;
  schoolDistrict: string;
  daysOnMarket: number;
  description: string;
  highlights: string[];
  features: string[];
  images: string[];
  priceHistory: PricePoint[];
  monthlyEstimate: number;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  verifiedSeller: boolean;
  verificationNotes: string[];
  badge: string;
  inquiries: number;
  saves: number;
  views: number;
  featured: boolean;
}

export interface SearchFilters {
  query: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
  minSqft: number;
  city: string;
  propertyType: 'all' | PropertyType;
  yearBuilt: number;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  company?: string;
  verified: boolean;
}

export interface Inquiry {
  id: string;
  homeId: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  quote: string;
}

export interface MarketTrend {
  month: string;
  medianPrice: number;
  inventory: number;
  daysOnMarket: number;
}

export interface SisterSite {
  name: string;
  url: string;
  description: string;
}
