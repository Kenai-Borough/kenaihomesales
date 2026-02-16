import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ListingsGrid } from './components/ListingsGrid';
import { RelatedSites } from './components/RelatedSites';
import { ContactForm } from './components/ContactForm';
import { SEO } from './components/SEO';
import { sampleListings } from './data/listings';
import { siteConfig } from './lib/config';
import './index.css';

function App() {
  // Filter listings based on site type
  const filteredListings = sampleListings.filter(listing => 
    siteConfig.listingTypes.includes('all') || siteConfig.listingTypes.includes(listing.type)
  );

  return (
    <>
      <SEO />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ListingsGrid listings={filteredListings} />
          </div>
          
          <RelatedSites />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;
