const fs = require('fs');
const path = require('path');

// Function to fetch blogs from your API
async function fetchBlogs() {
  try {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/blogs/`);
    const data = await response.json();
    return data.blogs || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

// Function to generate sitemap XML
function generateSitemap(blogs) {
  const baseUrl = 'https://prepnexus.netlify.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/jobs</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/dsa</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/aptitude</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/interview</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/dashboard</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <priority>0.8</priority>
  </url>`;

  // Add blog posts
  blogs.forEach(blog => {
    const blogDate = blog.date || currentDate;
    sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.id}</loc>
    <lastmod>${blogDate}</lastmod>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Main function
async function main() {
  console.log('Fetching blogs for sitemap...');
  const blogs = await fetchBlogs();
  console.log(`Found ${blogs.length} blogs`);
  
  const sitemap = generateSitemap(blogs);
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap generated successfully!');
}

main().catch(console.error); 