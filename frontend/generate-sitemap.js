const Sitemap = require('react-router-sitemap').default;
const path = require('path');

// Minimal static routes
const routes = [
  '/',
  '/blog',
  '/blog/:id',
];

// Minimal blog IDs for demonstration
const blogIds = [40, 39];

const paramsConfig = {
  '/blog/:id': blogIds.map(id => ({ id })),
};

function generateSitemap() {
  return (
    new Sitemap(routes)
      .applyParams(paramsConfig)
      .build('https://prepnexus.netlify.app')
      .save(path.resolve(__dirname, 'public', 'sitemap.xml'))
  );
}

generateSitemap(); 