import { useEffect } from 'react';
import { SITE_URL, DEFAULT_OG, type PageMeta } from '../data/siteMeta';

/** DOM helpers for head tags */
const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const absolute = (p: string) => (p.startsWith('http') ? p : `${SITE_URL}${p}`);

/**
 * SEO/AEO head manager — call once per page component.
 * Sets <title>, meta description, Open Graph, Twitter Card, canonical
 * and injects the page's JSON-LD structured data.
 */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;

    // Primary SEO
    setMeta('name', 'description', meta.description);
    setMeta('name', 'robots', 'index, follow, max-image-preview:large');
    setLink('canonical', `${SITE_URL}${meta.path}`);

    // Open Graph (social covers)
    setMeta('property', 'og:site_name', 'WINF™');
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', `${SITE_URL}${meta.path}`);
    setMeta('property', 'og:image', absolute(meta.image || DEFAULT_OG));
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:locale', 'pt_BR');

    // Twitter/X card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', absolute(meta.image || DEFAULT_OG));

    // Above-the-fold image preloads (hero posters) — faster LCP
    document.head.querySelectorAll('link[rel=preload][as=image]').forEach((l) => l.remove());
    for (const img of meta.preloadImages || []) {
      const l = document.createElement('link');
      l.setAttribute('rel', 'preload');
      l.setAttribute('as', 'image');
      l.setAttribute('href', img);
      document.head.appendChild(l);
    }

    // AEO — JSON-LD structured data for this page
    if (meta.jsonLd?.length) {
      let el = document.head.querySelector<HTMLScriptElement>('script[data-page-jsonld]');
      if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute('data-page-jsonld', '');
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(meta.jsonLd.length === 1 ? meta.jsonLd[0] : meta.jsonLd);
    } else {
      document.head.querySelector('script[data-page-jsonld]')?.remove();
    }
  }, [meta.title, meta.description, meta.path, meta.image, meta.jsonLd]);
}
