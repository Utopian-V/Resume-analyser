/**
 * Structured Data Component
 * Handled by: SEO Team
 * Responsibilities: JSON-LD structured data for search engines
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const StructuredData = ({ type, data }) => {
  const generateStructuredData = () => {
    switch (type) {
      case 'blog':
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": data.title,
          "author": {
            "@type": "Person",
            "name": data.author
          },
          "datePublished": data.created_at,
          "dateModified": data.updated_at || data.created_at,
          "publisher": {
            "@type": "Organization",
            "name": "PrepNexus",
            "logo": {
              "@type": "ImageObject",
              "url": "https://prepnexus.netlify.app/logo.png"
            }
          },
          "description": data.description || data.content.substring(0, 160),
          "image": data.image,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://prepnexus.netlify.app/blog/${data.id}`
          }
        };
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "PrepNexus",
          "url": "https://prepnexus.netlify.app",
          "logo": "https://prepnexus.netlify.app/logo.png",
          "description": "AI-powered career preparation platform",
          "sameAs": [
            "https://twitter.com/prepnexus",
            "https://linkedin.com/company/prepnexus"
          ]
        };
      
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "PrepNexus",
          "url": "https://prepnexus.netlify.app",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://prepnexus.netlify.app/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };
      
      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();
  
  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData; 