import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  breadcrumbs?: { name: string; path: string }[];
  schemaType?: 'WebApplication' | 'Article' | 'WebSite';
  faqItems?: { question: string; answer: string }[];
}

export function SeoHead({
  title,
  description,
  path,
  breadcrumbs,
  schemaType = 'WebApplication',
  faqItems,
}: SeoProps) {
  useEffect(() => {
    // 1. Update Document Title
    const fullTitle = `${title} | StatMetric`;
    document.title = fullTitle;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Update OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    ogUrl.setAttribute('content', `${currentOrigin}${path}`);

    // 4. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${currentOrigin}${path}`);

    // 5. Inject Structured Data JSON-LD
    const schemas: Record<string, unknown>[] = [];

    // Base Application / Website Schema
    if (schemaType === 'WebApplication') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        url: `${currentOrigin}${path}`,
        description,
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
    }

    // Breadcrumbs Schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: crumb.name,
          item: `${currentOrigin}${crumb.path}`,
        })),
      });
    }

    // FAQ Schema
    if (faqItems && faqItems.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      });
    }

    // Remove existing dynamic script
    const existingScript = document.getElementById('statmetric-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (schemas.length > 0) {
      const script = document.createElement('script');
      script.id = 'statmetric-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }

    return () => {
      const scriptToRemove = document.getElementById('statmetric-jsonld');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, path, breadcrumbs, schemaType, faqItems]);

  return null;
}
