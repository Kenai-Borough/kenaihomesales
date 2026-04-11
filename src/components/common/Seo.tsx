import { useEffect } from 'react';
import { siteConfig } from '../../lib/config';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  schema?: Record<string, unknown>;
}

const ensureMeta = (selector: string, attribute: 'name' | 'property', value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  return element;
};

export function Seo({ title, description, path, image, schema }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | Kenai Home Sales`;
    ensureMeta('meta[name="description"]', 'name', 'description').content = description;
    ensureMeta('meta[property="og:title"]', 'property', 'og:title').content = title;
    ensureMeta('meta[property="og:description"]', 'property', 'og:description').content = description;
    ensureMeta('meta[property="og:url"]', 'property', 'og:url').content = `${siteConfig.url}${path}`;
    ensureMeta('meta[property="og:image"]', 'property', 'og:image').content =
      image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80';
  }, [description, image, path, title]);

  return schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /> : null;
}
