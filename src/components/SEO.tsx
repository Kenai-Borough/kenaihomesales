import { siteConfig } from '../lib/config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function SEO({ title, description, image, url }: SEOProps) {
  const siteTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const siteDescription = description || siteConfig.description;
  const siteImage = image || siteConfig.ogImage;
  const siteUrl = url || siteConfig.url;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': siteConfig.businessType,
    name: siteConfig.name,
    description: siteDescription,
    url: siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kenai Peninsula',
      addressRegion: 'AK',
      addressCountry: 'US'
    }
  };

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:url" content={siteUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
      
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </>
  );
}
