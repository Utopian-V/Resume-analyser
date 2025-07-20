/**
 * Meta Tags Component
 * Handled by: SEO Team
 * Responsibilities: Dynamic meta tags, Open Graph, Twitter Cards
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title, 
  description, 
  keywords = [], 
  image, 
  url, 
  type = 'website',
  author = 'PrepNexus Team'
}) => {
  const fullTitle = title ? `${title} | PrepNexus` : 'PrepNexus - Career Preparation Platform';
  const fullDescription = description || 'AI-powered career preparation with interview prep, DSA practice, and job opportunities';
  const fullImage = image || 'https://prepnexus.netlify.app/og-image.jpg';
  const fullUrl = url || 'https://prepnexus.netlify.app';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PrepNexus" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
};

export default MetaTags; 