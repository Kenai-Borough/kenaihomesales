export interface Listing {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  image: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  acres?: number;
  year?: number;
  features?: string[];
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  phone: string;
  email: string;
  address: string;
  businessType: string;
  primaryColor: string;
  relatedSites: RelatedSite[];
  listingTypes: string[];
}

export interface RelatedSite {
  name: string;
  url: string;
  description: string;
}
