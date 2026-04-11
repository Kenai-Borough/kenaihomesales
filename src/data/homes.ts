import { subMonths, formatISO } from 'date-fns';
import type { Home, MarketTrend, Review } from '../types';
import { monthlyMortgage } from '../lib/utils';

interface Seed {
  slug: string;
  title: string;
  city: Home['city'];
  latitude: number;
  longitude: number;
  neighborhood: string;
  propertyType: Home['propertyType'];
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
  description: string;
  highlights: string[];
  features: string[];
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  verifiedSeller: boolean;
  badge: string;
  inquiries: number;
  saves: number;
  views: number;
  featured: boolean;
}

const images = [
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7f34f676f0f?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
];

const zipCodes: Record<string, string> = {
  Kenai: '99611',
  Soldotna: '99669',
  Homer: '99603',
  Seward: '99664',
  Sterling: '99672',
  'Cooper Landing': '99572',
  Nikiski: '99635',
  'Anchor Point': '99556',
};

const seeds: Seed[] = [
  { slug: 'kenai-bluff-view', title: 'Kenai Bluff View Home With Heated Shop', city: 'Kenai', latitude: 60.561, longitude: -151.259, neighborhood: 'Bluff District', propertyType: 'single_family', price: 539000, bedrooms: 4, bathrooms: 3, sqft: 2520, lotSize: 0.66, yearBuilt: 2016, stories: 2, garageSpaces: 2, parkingSpaces: 4, hoaFee: 0, taxes: 4920, heating: 'In-floor radiant', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Cook Inlet & mountains', schoolDistrict: 'Kenai Peninsula Borough', description: 'Bright family home with vaulted windows, premium finishes, and a heated shop ready for Alaska gear or side projects.', highlights: ['Cook Inlet view', 'Dedicated office', 'Fresh interior paint'], features: ['Quartz counters', 'Mudroom', 'Trex deck', 'RV pad'], sellerName: 'Morgan Seller', sellerEmail: 'seller@kenaihomesales.com', sellerPhone: '(907) 555-1002', verifiedSeller: true, badge: 'Verified seller', inquiries: 12, saves: 26, views: 410, featured: true },
  { slug: 'soldotna-river-birch', title: 'Soldotna Birch Creek Entertainer', city: 'Soldotna', latitude: 60.489, longitude: -151.07, neighborhood: 'Birch Creek', propertyType: 'single_family', price: 468000, bedrooms: 3, bathrooms: 2, sqft: 2190, lotSize: 0.43, yearBuilt: 2013, stories: 1, garageSpaces: 2, parkingSpaces: 4, hoaFee: 0, taxes: 4330, heating: 'Natural gas forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Mature spruce buffer', schoolDistrict: 'Kenai Peninsula Borough', description: 'An easy-living ranch plan near schools, sports fields, and shopping, with a fenced yard and custom storage.', highlights: ['Single-level layout', 'Fenced yard', 'Close to schools'], features: ['Pantry', 'Gas fireplace', 'Storage shed'], sellerName: 'Morgan Seller', sellerEmail: 'seller@kenaihomesales.com', sellerPhone: '(907) 555-1002', verifiedSeller: true, badge: 'Seller verified', inquiries: 9, saves: 18, views: 331, featured: true },
  { slug: 'homer-ridge-retreat', title: 'Homer Ridge Retreat With Bay Views', city: 'Homer', latitude: 59.644, longitude: -151.54, neighborhood: 'West Hill', propertyType: 'single_family', price: 785000, bedrooms: 4, bathrooms: 3, sqft: 3120, lotSize: 0.88, yearBuilt: 2018, stories: 2, garageSpaces: 2, parkingSpaces: 6, hoaFee: 0, taxes: 6215, heating: 'Boiler baseboard', cooling: 'None', sewer: 'Septic', water: 'Cistern', view: 'Kachemak Bay panorama', schoolDistrict: 'Kenai Peninsula Borough', description: 'Show-stopping west hill residence with an expansive deck, warm wood detailing, and a detached studio for remote work or guests.', highlights: ['Bay panorama', 'Detached studio', 'Luxury kitchen'], features: ['Walk-in pantry', 'Sauna', 'Covered hot tub pad'], sellerName: 'Casey Bluff', sellerEmail: 'casey@kenaihomesales.com', sellerPhone: '(907) 555-2030', verifiedSeller: true, badge: 'Identity checked', inquiries: 14, saves: 31, views: 512, featured: true },
  { slug: 'seward-harbor-townhome', title: 'Seward Harbor Townhome Near Waterfront Trail', city: 'Seward', latitude: 60.121, longitude: -149.443, neighborhood: 'Harbor View', propertyType: 'townhouse', price: 424000, bedrooms: 3, bathrooms: 2, sqft: 1780, lotSize: 0.11, yearBuilt: 2020, stories: 3, garageSpaces: 1, parkingSpaces: 2, hoaFee: 180, taxes: 3820, heating: 'Electric baseboard', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Harbor & mountain', schoolDistrict: 'Seward schools', description: 'Low-maintenance coastal living with contemporary finishes, harbor proximity, and an easy lock-and-leave footprint.', highlights: ['Walk to harbor', 'Modern construction', 'Low maintenance'], features: ['Heated tile floors', 'Balcony', 'Storage room'], sellerName: 'Dana Harbor', sellerEmail: 'dana@kenaihomesales.com', sellerPhone: '(907) 555-2031', verifiedSeller: true, badge: 'Verification badge', inquiries: 7, saves: 21, views: 287, featured: false },
  { slug: 'sterling-lake-cabin', title: 'Sterling Lake Access Cabin Escape', city: 'Sterling', latitude: 60.541, longitude: -150.76, neighborhood: 'Scout Lake', propertyType: 'cabin', price: 298000, bedrooms: 2, bathrooms: 1, sqft: 1180, lotSize: 1.2, yearBuilt: 2008, stories: 2, garageSpaces: 0, parkingSpaces: 3, hoaFee: 0, taxes: 2275, heating: 'Wood stove + electric', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Lake access corridor', schoolDistrict: 'Kenai Peninsula Borough', description: 'A turnkey recreational cabin with year-round access, polished interiors, and room to launch fishing weekends.', highlights: ['Lake access', 'Year-round road', 'Short-term rental potential'], features: ['Loft sleeping', 'Fire pit', 'Drying room'], sellerName: 'Alex Cabin', sellerEmail: 'alex@kenaihomesales.com', sellerPhone: '(907) 555-2032', verifiedSeller: false, badge: 'Pending seller review', inquiries: 6, saves: 17, views: 260, featured: true },
  { slug: 'cooper-landing-river-bend', title: 'Cooper Landing River Bend Chalet', city: 'Cooper Landing', latitude: 60.486, longitude: -149.83, neighborhood: 'Quartz Creek', propertyType: 'cabin', price: 612000, bedrooms: 3, bathrooms: 2, sqft: 1960, lotSize: 0.79, yearBuilt: 2015, stories: 2, garageSpaces: 1, parkingSpaces: 4, hoaFee: 0, taxes: 3995, heating: 'In-floor radiant', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'River valley', schoolDistrict: 'Cooper Landing schools', description: 'Custom chalet designed for adventure buyers who want a strong home base between the Kenai River and mountain trails.', highlights: ['Adventure hub', 'Excellent rental demand', 'Scenic deck'], features: ['Gear room', 'Open trusses', 'Backup generator'], sellerName: 'Lena Guide', sellerEmail: 'lena@kenaihomesales.com', sellerPhone: '(907) 555-2033', verifiedSeller: true, badge: 'Verified seller', inquiries: 13, saves: 19, views: 350, featured: true },
  { slug: 'nikiski-family-acre', title: 'Nikiski Family Acre With Shop', city: 'Nikiski', latitude: 60.691, longitude: -151.29, neighborhood: 'Island Lake Road', propertyType: 'manufactured', price: 255000, bedrooms: 3, bathrooms: 2, sqft: 1480, lotSize: 1.5, yearBuilt: 2011, stories: 1, garageSpaces: 0, parkingSpaces: 6, hoaFee: 0, taxes: 1980, heating: 'Forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Open acreage', schoolDistrict: 'Kenai Peninsula Borough', description: 'Affordable acreage with a large shop, circular drive, and outdoor space for boats, trailers, and recreation gear.', highlights: ['Affordable acreage', 'Large shop', 'Boat parking'], features: ['Chicken coop', 'Covered porch', 'New skirting'], sellerName: 'Sam North', sellerEmail: 'sam@kenaihomesales.com', sellerPhone: '(907) 555-2034', verifiedSeller: true, badge: 'Seller verified', inquiries: 8, saves: 15, views: 244, featured: false },
  { slug: 'anchor-point-sunset-duplex', title: 'Anchor Point Sunset Duplex', city: 'Anchor Point', latitude: 59.778, longitude: -151.83, neighborhood: 'Milo Fritz', propertyType: 'multi_family', price: 512000, bedrooms: 4, bathrooms: 3, sqft: 2650, lotSize: 0.94, yearBuilt: 2014, stories: 2, garageSpaces: 2, parkingSpaces: 6, hoaFee: 0, taxes: 3870, heating: 'Boiler baseboard', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Sunset bluff', schoolDistrict: 'Chapman school area', description: 'Income-minded duplex with owner-occupant flexibility, private entries, and easy access to Anchor Point beaches.', highlights: ['Income potential', 'Owner-occupant option', 'Big lot'], features: ['Separate laundry', 'Storage shed', 'Deck'], sellerName: 'Jamie Coast', sellerEmail: 'jamie@kenaihomesales.com', sellerPhone: '(907) 555-2035', verifiedSeller: true, badge: 'Document verified', inquiries: 10, saves: 22, views: 301, featured: false },
  { slug: 'kenai-estuary-modern', title: 'Kenai Estuary Modern Farmhouse', city: 'Kenai', latitude: 60.555, longitude: -151.246, neighborhood: 'Estuary Landing', propertyType: 'single_family', price: 699000, bedrooms: 4, bathrooms: 3, sqft: 2980, lotSize: 0.71, yearBuilt: 2021, stories: 2, garageSpaces: 3, parkingSpaces: 6, hoaFee: 0, taxes: 5650, heating: 'Radiant + mini split', cooling: 'Mini split', sewer: 'City sewer', water: 'City water', view: 'Wetlands & mountains', schoolDistrict: 'Kenai Peninsula Borough', description: 'Newer farmhouse styling with a huge island kitchen, oversized garage, and a backyard built for summer evenings.', highlights: ['Newer build', 'Three-car garage', 'Mini split cooling'], features: ['Walk-in pantry', 'Covered patio', 'Primary suite soaking tub'], sellerName: 'Morgan Seller', sellerEmail: 'seller@kenaihomesales.com', sellerPhone: '(907) 555-1002', verifiedSeller: true, badge: 'Verified seller', inquiries: 16, saves: 34, views: 590, featured: true },
  { slug: 'soldotna-creekside-townhome', title: 'Soldotna Creekside Townhome', city: 'Soldotna', latitude: 60.486, longitude: -151.055, neighborhood: 'Creekside Commons', propertyType: 'townhouse', price: 339000, bedrooms: 2, bathrooms: 2, sqft: 1425, lotSize: 0.08, yearBuilt: 2019, stories: 2, garageSpaces: 1, parkingSpaces: 2, hoaFee: 165, taxes: 2810, heating: 'Forced air', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Greenbelt', schoolDistrict: 'Kenai Peninsula Borough', description: 'A crisp, low-maintenance townhome with quality finishes and quick access to Soldotna shopping, schools, and parks.', highlights: ['Lock-and-leave', 'Great first home', 'Greenbelt'], features: ['Quartz counters', 'Pantry', 'Private patio'], sellerName: 'Nina Creek', sellerEmail: 'nina@kenaihomesales.com', sellerPhone: '(907) 555-2036', verifiedSeller: true, badge: 'Identity checked', inquiries: 5, saves: 14, views: 205, featured: false },
  { slug: 'homer-artist-cottage', title: 'Homer Artist Cottage Near Spit Road', city: 'Homer', latitude: 59.639, longitude: -151.522, neighborhood: 'Town Center', propertyType: 'cabin', price: 365000, bedrooms: 2, bathrooms: 2, sqft: 1320, lotSize: 0.18, yearBuilt: 2005, stories: 1, garageSpaces: 0, parkingSpaces: 2, hoaFee: 0, taxes: 2490, heating: 'Hydronic baseboard', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Town + bay glimpses', schoolDistrict: 'Homer schools', description: 'Charming cottage with custom millwork, creative studio vibes, and easy access to local galleries and the Homer Spit.', highlights: ['Artistic detailing', 'Walkable pocket', 'Flexible studio'], features: ['Skylights', 'Custom shelving', 'Garden beds'], sellerName: 'Casey Bluff', sellerEmail: 'casey@kenaihomesales.com', sellerPhone: '(907) 555-2030', verifiedSeller: true, badge: 'Seller verified', inquiries: 4, saves: 16, views: 222, featured: false },
  { slug: 'seward-resurrection-view', title: 'Seward Resurrection View Duplex', city: 'Seward', latitude: 60.116, longitude: -149.438, neighborhood: 'Railway Terrace', propertyType: 'multi_family', price: 598000, bedrooms: 4, bathrooms: 3, sqft: 2410, lotSize: 0.22, yearBuilt: 2017, stories: 2, garageSpaces: 1, parkingSpaces: 4, hoaFee: 0, taxes: 4388, heating: 'Boiler baseboard', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Resurrection Bay', schoolDistrict: 'Seward schools', description: 'Turnkey duplex with owner suite, bay views, and short distance to harbor jobs, tourism amenities, and trails.', highlights: ['Bay views', 'Income flexibility', 'Updated systems'], features: ['Separate entrances', 'Shared laundry', 'Deck'], sellerName: 'Dana Harbor', sellerEmail: 'dana@kenaihomesales.com', sellerPhone: '(907) 555-2031', verifiedSeller: true, badge: 'Document verified', inquiries: 11, saves: 13, views: 271, featured: false },
  { slug: 'sterling-meadow-ranch', title: 'Sterling Meadow Ranch Home', city: 'Sterling', latitude: 60.538, longitude: -150.81, neighborhood: 'Moose River', propertyType: 'single_family', price: 415000, bedrooms: 3, bathrooms: 2, sqft: 1885, lotSize: 1.04, yearBuilt: 2010, stories: 1, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 3025, heating: 'Forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Open meadow', schoolDistrict: 'Kenai Peninsula Borough', description: 'Comfortable ranch layout on a usable acre with mature trees, detached storage, and an easy Sterling commute.', highlights: ['Single-level', 'Usable acre', 'Detached storage'], features: ['Chicken run', 'Wood shed', 'Covered entry'], sellerName: 'Pat Meadow', sellerEmail: 'pat@kenaihomesales.com', sellerPhone: '(907) 555-2037', verifiedSeller: false, badge: 'Pending seller review', inquiries: 6, saves: 11, views: 188, featured: false },
  { slug: 'cooper-landing-alpine-modern', title: 'Cooper Landing Alpine Modern', city: 'Cooper Landing', latitude: 60.49, longitude: -149.82, neighborhood: 'Bean Creek', propertyType: 'single_family', price: 748000, bedrooms: 4, bathrooms: 3, sqft: 2860, lotSize: 0.92, yearBuilt: 2022, stories: 2, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 5210, heating: 'Radiant slab', cooling: 'Mini split', sewer: 'Septic', water: 'Private well', view: 'Mountain peaks', schoolDistrict: 'Cooper Landing schools', description: 'High-design mountain home with energy-efficient systems, designer lighting, and a dramatic wall of windows.', highlights: ['Newer modern design', 'Energy efficient', 'Mountain views'], features: ['Mini splits', 'Mudroom lockers', 'Designer lighting'], sellerName: 'Lena Guide', sellerEmail: 'lena@kenaihomesales.com', sellerPhone: '(907) 555-2033', verifiedSeller: true, badge: 'Verified seller', inquiries: 15, saves: 24, views: 389, featured: true },
  { slug: 'nikiski-coastal-cabin', title: 'Nikiski Coastal Weekend Cabin', city: 'Nikiski', latitude: 60.701, longitude: -151.31, neighborhood: 'Captain Cook Estates', propertyType: 'cabin', price: 214000, bedrooms: 1, bathrooms: 1, sqft: 840, lotSize: 0.5, yearBuilt: 2004, stories: 1, garageSpaces: 0, parkingSpaces: 3, hoaFee: 0, taxes: 1450, heating: 'Propane stove', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Coastal woods', schoolDistrict: 'Kenai Peninsula Borough', description: 'Simple and clean weekend retreat just far enough from town to feel remote while still staying convenient.', highlights: ['Affordable getaway', 'Clean and simple', 'Close to coast'], features: ['Covered porch', 'Storage shed', 'Generator hookup'], sellerName: 'Sam North', sellerEmail: 'sam@kenaihomesales.com', sellerPhone: '(907) 555-2034', verifiedSeller: false, badge: 'Pending seller review', inquiries: 3, saves: 9, views: 144, featured: false },
  { slug: 'anchor-point-family-harvest', title: 'Anchor Point Family Harvest Home', city: 'Anchor Point', latitude: 59.781, longitude: -151.81, neighborhood: 'Mile 157', propertyType: 'single_family', price: 456000, bedrooms: 3, bathrooms: 2, sqft: 2050, lotSize: 1.8, yearBuilt: 2012, stories: 2, garageSpaces: 2, parkingSpaces: 6, hoaFee: 0, taxes: 3210, heating: 'Wood + boiler', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Pasture & inlet sunsets', schoolDistrict: 'Chapman school area', description: 'A warm and practical home with room for gardens, hobbies, and sunset dinners after beach days.', highlights: ['Room for gardens', 'Big lot', 'Sunset skies'], features: ['Greenhouse', 'Chicken coop', 'Mudroom'], sellerName: 'Jamie Coast', sellerEmail: 'jamie@kenaihomesales.com', sellerPhone: '(907) 555-2035', verifiedSeller: true, badge: 'Seller verified', inquiries: 9, saves: 12, views: 199, featured: false },
  { slug: 'kenai-schoolyard-classic', title: 'Kenai Schoolyard Classic', city: 'Kenai', latitude: 60.554, longitude: -151.27, neighborhood: 'Crown Point', propertyType: 'single_family', price: 389000, bedrooms: 3, bathrooms: 2, sqft: 1840, lotSize: 0.32, yearBuilt: 2007, stories: 1, garageSpaces: 2, parkingSpaces: 4, hoaFee: 0, taxes: 2840, heating: 'Forced air', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Neighborhood park', schoolDistrict: 'Kenai Peninsula Borough', description: 'An approachable Kenai home with quality updates, close-to-town convenience, and a layout that works for everyday life.', highlights: ['Close to schools', 'Updated flooring', 'Great value'], features: ['Pantry', 'Fenced yard', 'Storage loft'], sellerName: 'Morgan Seller', sellerEmail: 'seller@kenaihomesales.com', sellerPhone: '(907) 555-1002', verifiedSeller: true, badge: 'Verified seller', inquiries: 7, saves: 18, views: 275, featured: false },
  { slug: 'soldotna-cedar-duplex', title: 'Soldotna Cedar Duplex Investment', city: 'Soldotna', latitude: 60.481, longitude: -151.06, neighborhood: 'Cedar Street', propertyType: 'multi_family', price: 584000, bedrooms: 4, bathrooms: 4, sqft: 2740, lotSize: 0.4, yearBuilt: 2016, stories: 2, garageSpaces: 2, parkingSpaces: 6, hoaFee: 0, taxes: 4415, heating: 'Forced air', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Neighborhood greenspace', schoolDistrict: 'Kenai Peninsula Borough', description: 'Modern duplex with consistent rental history and a location that remains attractive to long-term tenants and owner occupants.', highlights: ['Rental history', 'City utilities', 'Two garages'], features: ['Separate meters', 'Private patios', 'Storage rooms'], sellerName: 'Nina Creek', sellerEmail: 'nina@kenaihomesales.com', sellerPhone: '(907) 555-2036', verifiedSeller: true, badge: 'Identity checked', inquiries: 8, saves: 10, views: 182, featured: false },
  { slug: 'homer-bayline-townhome', title: 'Homer Bayline Townhome', city: 'Homer', latitude: 59.646, longitude: -151.531, neighborhood: 'Bayline', propertyType: 'townhouse', price: 432000, bedrooms: 3, bathrooms: 2, sqft: 1610, lotSize: 0.09, yearBuilt: 2021, stories: 2, garageSpaces: 1, parkingSpaces: 2, hoaFee: 210, taxes: 2990, heating: 'In-floor radiant', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Bay glimpse', schoolDistrict: 'Homer schools', description: 'Modern townhome tucked near Homer conveniences with stylish finishes and minimal exterior maintenance.', highlights: ['Near downtown', 'Radiant heat', 'Newer construction'], features: ['Quartz counters', 'Tile shower', 'Private balcony'], sellerName: 'Casey Bluff', sellerEmail: 'casey@kenaihomesales.com', sellerPhone: '(907) 555-2030', verifiedSeller: true, badge: 'Document verified', inquiries: 5, saves: 13, views: 176, featured: false },
  { slug: 'seward-mountain-modern', title: 'Seward Mountain Modern House', city: 'Seward', latitude: 60.125, longitude: -149.45, neighborhood: 'Lowell Point Road', propertyType: 'single_family', price: 655000, bedrooms: 3, bathrooms: 2, sqft: 2280, lotSize: 0.36, yearBuilt: 2019, stories: 2, garageSpaces: 1, parkingSpaces: 4, hoaFee: 0, taxes: 4620, heating: 'Electric + wood stove', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Mountain amphitheater', schoolDistrict: 'Seward schools', description: 'Architectural contemporary with oversized windows and direct access to the outdoor lifestyle Seward buyers crave.', highlights: ['Architectural design', 'Adventure access', 'Premium windows'], features: ['Gear wash station', 'Window wall', 'Covered entry'], sellerName: 'Dana Harbor', sellerEmail: 'dana@kenaihomesales.com', sellerPhone: '(907) 555-2031', verifiedSeller: true, badge: 'Verification badge', inquiries: 12, saves: 15, views: 240, featured: true },
  { slug: 'sterling-forest-cabin', title: 'Sterling Forest Cabin on 2 Acres', city: 'Sterling', latitude: 60.545, longitude: -150.79, neighborhood: 'Scout Lake North', propertyType: 'cabin', price: 246000, bedrooms: 2, bathrooms: 1, sqft: 980, lotSize: 2.0, yearBuilt: 2002, stories: 1, garageSpaces: 0, parkingSpaces: 4, hoaFee: 0, taxes: 1720, heating: 'Wood stove', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Forest privacy', schoolDistrict: 'Kenai Peninsula Borough', description: 'Private forest cabin with fresh interior finishes and room to expand if your Alaska plans grow.', highlights: ['Two acres', 'Private setting', 'Expand later'], features: ['Loft storage', 'Generator shed', 'Fire circle'], sellerName: 'Pat Meadow', sellerEmail: 'pat@kenaihomesales.com', sellerPhone: '(907) 555-2037', verifiedSeller: false, badge: 'Pending seller review', inquiries: 2, saves: 8, views: 120, featured: false },
  { slug: 'cooper-landing-rental-ready', title: 'Cooper Landing Rental-Ready Duplex', city: 'Cooper Landing', latitude: 60.493, longitude: -149.835, neighborhood: 'Sportsman Lane', propertyType: 'multi_family', price: 706000, bedrooms: 5, bathrooms: 4, sqft: 3010, lotSize: 0.61, yearBuilt: 2017, stories: 2, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 4980, heating: 'Radiant slab', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'River valley', schoolDistrict: 'Cooper Landing schools', description: 'Purpose-built duplex that works for guides, tourism staff, or multi-generational living in the heart of Cooper Landing.', highlights: ['Rental-ready', 'Tourism corridor', 'Flexible use'], features: ['Owner suite', 'Mudroom', 'Deck'], sellerName: 'Lena Guide', sellerEmail: 'lena@kenaihomesales.com', sellerPhone: '(907) 555-2033', verifiedSeller: true, badge: 'Verified seller', inquiries: 10, saves: 11, views: 164, featured: false },
  { slug: 'nikiski-northern-lights-home', title: 'Nikiski Northern Lights Home', city: 'Nikiski', latitude: 60.688, longitude: -151.27, neighborhood: 'Myrtlewood', propertyType: 'single_family', price: 334000, bedrooms: 3, bathrooms: 2, sqft: 1720, lotSize: 0.92, yearBuilt: 2010, stories: 1, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 2490, heating: 'Forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Boreal forest', schoolDistrict: 'Kenai Peninsula Borough', description: 'Well-kept Nikiski home with practical updates, natural privacy, and a great price point for primary or second-home buyers.', highlights: ['Forest privacy', 'Good value', 'Updated furnace'], features: ['Covered porch', 'Storage shed', 'RV pad'], sellerName: 'Sam North', sellerEmail: 'sam@kenaihomesales.com', sellerPhone: '(907) 555-2034', verifiedSeller: true, badge: 'Seller verified', inquiries: 6, saves: 9, views: 145, featured: false },
  { slug: 'anchor-point-bluff-cottage', title: 'Anchor Point Bluff Cottage', city: 'Anchor Point', latitude: 59.776, longitude: -151.845, neighborhood: 'Bluffside', propertyType: 'cabin', price: 278000, bedrooms: 2, bathrooms: 1, sqft: 1040, lotSize: 0.36, yearBuilt: 2001, stories: 1, garageSpaces: 0, parkingSpaces: 3, hoaFee: 0, taxes: 1895, heating: 'Toyo stove', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Ocean bluff peeks', schoolDistrict: 'Chapman school area', description: 'A cozy coastal cottage near beach access, perfect for buyers who want an affordable foothold near world-class fishing.', highlights: ['Near beach access', 'Affordable coastal option', 'Updated bath'], features: ['New roof', 'Deck', 'Boat parking'], sellerName: 'Jamie Coast', sellerEmail: 'jamie@kenaihomesales.com', sellerPhone: '(907) 555-2035', verifiedSeller: false, badge: 'Pending seller review', inquiries: 4, saves: 8, views: 129, featured: false },
  { slug: 'kenai-river-meadow', title: 'Kenai River Meadow Home', city: 'Kenai', latitude: 60.549, longitude: -151.24, neighborhood: 'River Meadow', propertyType: 'single_family', price: 615000, bedrooms: 4, bathrooms: 3, sqft: 2710, lotSize: 0.58, yearBuilt: 2017, stories: 2, garageSpaces: 3, parkingSpaces: 6, hoaFee: 0, taxes: 5035, heating: 'Forced air + fireplace', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Meadow & river corridor', schoolDistrict: 'Kenai Peninsula Borough', description: 'A polished home for buyers who want extra space, great storage, and a location that keeps Kenai schools and recreation close.', highlights: ['Three-car garage', 'Flexible bonus room', 'River corridor'], features: ['Bonus room', 'Gas fireplace', 'Large pantry'], sellerName: 'Morgan Seller', sellerEmail: 'seller@kenaihomesales.com', sellerPhone: '(907) 555-1002', verifiedSeller: true, badge: 'Verified seller', inquiries: 11, saves: 17, views: 221, featured: true },
  { slug: 'soldotna-harvest-ranch', title: 'Soldotna Harvest Ranch', city: 'Soldotna', latitude: 60.492, longitude: -151.049, neighborhood: 'Poppy Lane', propertyType: 'manufactured', price: 229000, bedrooms: 3, bathrooms: 2, sqft: 1380, lotSize: 0.71, yearBuilt: 2009, stories: 1, garageSpaces: 0, parkingSpaces: 4, hoaFee: 0, taxes: 1660, heating: 'Forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Garden acreage', schoolDistrict: 'Kenai Peninsula Borough', description: 'Updated manufactured home with a functional layout, fenced yard, and a strong price point for first-time buyers.', highlights: ['Great value', 'Fenced yard', 'Updated flooring'], features: ['Garden beds', 'Storage shed', 'Mudroom'], sellerName: 'Nina Creek', sellerEmail: 'nina@kenaihomesales.com', sellerPhone: '(907) 555-2036', verifiedSeller: true, badge: 'Identity checked', inquiries: 5, saves: 10, views: 160, featured: false },
  { slug: 'homer-hillside-modern', title: 'Homer Hillside Modern', city: 'Homer', latitude: 59.648, longitude: -151.546, neighborhood: 'Skyline', propertyType: 'single_family', price: 729000, bedrooms: 4, bathrooms: 3, sqft: 2890, lotSize: 0.74, yearBuilt: 2020, stories: 2, garageSpaces: 2, parkingSpaces: 4, hoaFee: 0, taxes: 5525, heating: 'Radiant heat', cooling: 'Mini split', sewer: 'Septic', water: 'Cistern', view: 'Bay panorama', schoolDistrict: 'Homer schools', description: 'High-style hillside home with dramatic glazing, polished finishes, and a location that feels private without losing convenience.', highlights: ['Bay panorama', 'High-style design', 'Mini split comfort'], features: ['Butler pantry', 'Window wall', 'Built-in office'], sellerName: 'Casey Bluff', sellerEmail: 'casey@kenaihomesales.com', sellerPhone: '(907) 555-2030', verifiedSeller: true, badge: 'Document verified', inquiries: 13, saves: 20, views: 272, featured: true },
  { slug: 'seward-gateway-cabin', title: 'Seward Gateway Cabin', city: 'Seward', latitude: 60.117, longitude: -149.452, neighborhood: 'Gateway', propertyType: 'cabin', price: 312000, bedrooms: 2, bathrooms: 1, sqft: 1165, lotSize: 0.16, yearBuilt: 1999, stories: 1, garageSpaces: 0, parkingSpaces: 2, hoaFee: 0, taxes: 2140, heating: 'Electric + pellet stove', cooling: 'None', sewer: 'City sewer', water: 'City water', view: 'Mountain backdrop', schoolDistrict: 'Seward schools', description: 'Updated Seward cabin with bright interiors, easy trail access, and a proven guest appeal for weekend visitors.', highlights: ['Trail access', 'Bright interior', 'Guest appeal'], features: ['Pellet stove', 'Deck', 'Storage loft'], sellerName: 'Dana Harbor', sellerEmail: 'dana@kenaihomesales.com', sellerPhone: '(907) 555-2031', verifiedSeller: true, badge: 'Verification badge', inquiries: 6, saves: 9, views: 133, featured: false },
  { slug: 'sterling-river-view-home', title: 'Sterling River View Home', city: 'Sterling', latitude: 60.532, longitude: -150.77, neighborhood: 'Kenai River Ridge', propertyType: 'single_family', price: 522000, bedrooms: 4, bathrooms: 3, sqft: 2440, lotSize: 0.84, yearBuilt: 2016, stories: 2, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 3660, heating: 'Boiler baseboard', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'River bluff', schoolDistrict: 'Kenai Peninsula Borough', description: 'Spacious family home perched above the river corridor with a flexible lower level and an oversized deck for entertaining.', highlights: ['River bluff', 'Flexible lower level', 'Oversized deck'], features: ['Wet bar', 'Mudroom', 'Storage shed'], sellerName: 'Pat Meadow', sellerEmail: 'pat@kenaihomesales.com', sellerPhone: '(907) 555-2037', verifiedSeller: true, badge: 'Seller verified', inquiries: 7, saves: 12, views: 167, featured: false },
  { slug: 'cooper-landing-forest-loft', title: 'Cooper Landing Forest Loft', city: 'Cooper Landing', latitude: 60.487, longitude: -149.815, neighborhood: 'Forest Glen', propertyType: 'townhouse', price: 447000, bedrooms: 3, bathrooms: 2, sqft: 1545, lotSize: 0.12, yearBuilt: 2021, stories: 2, garageSpaces: 1, parkingSpaces: 3, hoaFee: 145, taxes: 2988, heating: 'Radiant floor', cooling: 'None', sewer: 'Septic', water: 'Community well', view: 'Forest and ridgeline', schoolDistrict: 'Cooper Landing schools', description: 'A fresh, efficient mountain townhouse offering modern finishes and a prime location for buyers who want turnkey convenience.', highlights: ['Turnkey mountain living', 'Modern finishes', 'Community well'], features: ['Radiant floor', 'Quartz counters', 'Private deck'], sellerName: 'Lena Guide', sellerEmail: 'lena@kenaihomesales.com', sellerPhone: '(907) 555-2033', verifiedSeller: true, badge: 'Verified seller', inquiries: 5, saves: 9, views: 118, featured: false },
  { slug: 'nikiski-shop-house', title: 'Nikiski Shop House on Big Lot', city: 'Nikiski', latitude: 60.695, longitude: -151.301, neighborhood: 'Cabin Lake', propertyType: 'manufactured', price: 268000, bedrooms: 3, bathrooms: 2, sqft: 1465, lotSize: 1.3, yearBuilt: 2012, stories: 1, garageSpaces: 0, parkingSpaces: 6, hoaFee: 0, taxes: 1905, heating: 'Forced air', cooling: 'None', sewer: 'Septic', water: 'Private well', view: 'Open lot', schoolDistrict: 'Kenai Peninsula Borough', description: 'A practical property with a coveted shop, strong parking, and a flexible lot for boats, trailers, and projects.', highlights: ['Big shop', 'Large lot', 'Parking flexibility'], features: ['RV outlet', 'Lean-to', 'Updated skirting'], sellerName: 'Sam North', sellerEmail: 'sam@kenaihomesales.com', sellerPhone: '(907) 555-2034', verifiedSeller: true, badge: 'Seller verified', inquiries: 4, saves: 8, views: 121, featured: false },
  { slug: 'anchor-point-coastal-modern', title: 'Anchor Point Coastal Modern', city: 'Anchor Point', latitude: 59.784, longitude: -151.832, neighborhood: 'Headlands', propertyType: 'single_family', price: 638000, bedrooms: 4, bathrooms: 3, sqft: 2630, lotSize: 0.62, yearBuilt: 2022, stories: 2, garageSpaces: 2, parkingSpaces: 5, hoaFee: 0, taxes: 4410, heating: 'Radiant slab', cooling: 'Mini split', sewer: 'Septic', water: 'Private well', view: 'Cook Inlet sunsets', schoolDistrict: 'Chapman school area', description: 'A newer coastal home with crisp lines, thoughtful storage, and dramatic sunset views for buyers seeking design plus function.', highlights: ['Newer coastal build', 'Sunset views', 'Thoughtful storage'], features: ['Walk-in pantry', 'Mini split', 'Covered deck'], sellerName: 'Jamie Coast', sellerEmail: 'jamie@kenaihomesales.com', sellerPhone: '(907) 555-2035', verifiedSeller: true, badge: 'Document verified', inquiries: 9, saves: 13, views: 158, featured: true },
];

const makeHistory = (price: number) => [
  { date: formatISO(subMonths(new Date(), 6), { representation: 'date' }), price: Math.round(price * 0.93), label: 'Initial valuation' },
  { date: formatISO(subMonths(new Date(), 3), { representation: 'date' }), price: Math.round(price * 1.02), label: 'Listed' },
  { date: formatISO(subMonths(new Date(), 1), { representation: 'date' }), price, label: 'Current price' },
];

export const homes: Home[] = seeds.map((seed, index) => ({
  id: seed.slug,
  slug: seed.slug,
  title: seed.title,
  city: seed.city,
  state: 'AK',
  zipCode: zipCodes[seed.city],
  address: `${100 + index * 7} ${seed.neighborhood} Lane`,
  latitude: seed.latitude,
  longitude: seed.longitude,
  neighborhood: seed.neighborhood,
  propertyType: seed.propertyType,
  status: 'active',
  price: seed.price,
  bedrooms: seed.bedrooms,
  bathrooms: seed.bathrooms,
  sqft: seed.sqft,
  lotSize: seed.lotSize,
  yearBuilt: seed.yearBuilt,
  stories: seed.stories,
  garageSpaces: seed.garageSpaces,
  parkingSpaces: seed.parkingSpaces,
  hoaFee: seed.hoaFee,
  taxes: seed.taxes,
  heating: seed.heating,
  cooling: seed.cooling,
  sewer: seed.sewer,
  water: seed.water,
  view: seed.view,
  schoolDistrict: seed.schoolDistrict,
  daysOnMarket: 8 + (index % 23),
  description: seed.description,
  highlights: seed.highlights,
  features: seed.features,
  images: [images[index % images.length], images[(index + 1) % images.length], images[(index + 2) % images.length]],
  priceHistory: makeHistory(seed.price),
  monthlyEstimate: Math.round(monthlyMortgage(seed.price)),
  sellerName: seed.sellerName,
  sellerEmail: seed.sellerEmail,
  sellerPhone: seed.sellerPhone,
  verifiedSeller: seed.verifiedSeller,
  verificationNotes: seed.verifiedSeller ? ['Government ID reviewed', 'Ownership docs confirmed', 'Response rate monitored'] : ['Identity check in progress', 'Listing still visible while docs are reviewed'],
  badge: seed.badge,
  inquiries: seed.inquiries,
  saves: seed.saves,
  views: seed.views,
  featured: seed.featured,
}));

export const featuredHomes = homes.filter((home) => home.featured).slice(0, 8);

export const marketTrends: MarketTrend[] = [
  { month: 'Jan', medianPrice: 392000, inventory: 41, daysOnMarket: 44 },
  { month: 'Feb', medianPrice: 401000, inventory: 39, daysOnMarket: 41 },
  { month: 'Mar', medianPrice: 415000, inventory: 45, daysOnMarket: 38 },
  { month: 'Apr', medianPrice: 429000, inventory: 48, daysOnMarket: 34 },
  { month: 'May', medianPrice: 444000, inventory: 52, daysOnMarket: 31 },
  { month: 'Jun', medianPrice: 456000, inventory: 57, daysOnMarket: 28 },
];

export const reviews: Review[] = [
  { id: 'r1', author: 'Karissa & Ben', city: 'Kenai', rating: 5, quote: 'We sold direct, kept more equity, and still looked every bit as polished as an agent-listed home.' },
  { id: 'r2', author: 'Jordan P.', city: 'Soldotna', rating: 5, quote: 'The map search and mortgage tools made it easy to compare homes and move quickly when we found the right fit.' },
  { id: 'r3', author: 'Lydia M.', city: 'Homer', rating: 5, quote: 'Verification badges and the Alaska closing guide made the FSBO process feel credible and clear.' },
];

export const whySellDirect = [
  'Keep more equity by avoiding a traditional 5–6% listing structure.',
  'Control your pricing strategy with local market stats and direct buyer feedback.',
  'Use verification badges, disclosures, and polished property pages to build buyer trust.',
];

export const closingChecklist = [
  'Gather property disclosure forms, utility details, and any well or septic records.',
  'Order title, confirm payoff information, and define earnest money handling early.',
  'Verify buyer financing or proof of funds before accepting inspection timelines.',
  'Coordinate appraisal, contingency removal, and final possession terms in writing.',
  'Schedule signing, funding, and recording with your Alaska title or escrow partner.',
];
