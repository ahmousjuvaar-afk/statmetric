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
    // 1. Update Document Title cleanly
    const fullTitle = title.includes('StatMetric') ? title : `${title} | StatMetric`;
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
    const setMetaTag = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://statmetric.org';
    const canonicalUrl = `${currentOrigin}${path}`;
    const ogImageUrl = `${currentOrigin}/og-image.svg`;

    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:site_name', 'StatMetric');
    setMetaTag('property', 'og:type', schemaType === 'WebSite' ? 'website' : 'article');
    setMetaTag('property', 'og:image', ogImageUrl);

    // 4. Update Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImageUrl);

    // 5. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 6. Inject Structured Data JSON-LD
    const schemas: Record<string, unknown>[] = [];

    // Organization Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'StatMetric',
      url: currentOrigin,
      logo: `${currentOrigin}/favicon.svg`,
      description: 'Open quantitative computing & research toolkit.',
    };

    if (schemaType === 'WebSite') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'StatMetric',
        url: currentOrigin,
        description,
        publisher: orgSchema,
      });
      schemas.push(orgSchema);
    } else if (schemaType === 'WebApplication') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: title.replace(/ \| StatMetric.*$/, ''),
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'All',
        url: canonicalUrl,
        description,
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        publisher: orgSchema,
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
