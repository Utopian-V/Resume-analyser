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

// Function to format date for RSS
function formatRSSDate(dateString) {
  const date = new Date(dateString);
  return date.toUTCString();
}

// Function to generate RSS XML
function generateRSS(blogs) {
  const baseUrl = 'https://prepnexus.netlify.app';
  const currentDate = new Date().toUTCString();
  
  let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Prep Nexus Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Insights, tips, and guides to help you grow your career.</description>
    <language>en-us</language>
    <copyright>Prep Nexus</copyright>
    <ttl>60</ttl>
    <lastBuildDate>${currentDate}</lastBuildDate>`;

  // Add blog posts
  blogs.forEach(blog => {
    const pubDate = formatRSSDate(blog.date);
    const description = blog.summary || blog.content.substring(0, 200) + '...';
    
    rss += `
    <item>
      <title>${blog.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
      <link>${baseUrl}/blog/${blog.id}</link>
      <description>${description.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</description>
      <author>${blog.author.name}</author>
      <pubDate>${pubDate}</pubDate>
      <guid>${baseUrl}/blog/${blog.id}</guid>
    </item>`;
  });

  rss += `
  </channel>
</rss>`;

  return rss;
}

// Main function
async function main() {
  console.log('Fetching blogs for RSS feed...');
  const blogs = await fetchBlogs();
  console.log(`Found ${blogs.length} blogs`);
  
  const rss = generateRSS(blogs);
  const rssPath = path.join(__dirname, '../public/rss.xml');
  
  fs.writeFileSync(rssPath, rss);
  console.log('RSS feed generated successfully!');
}

main().catch(console.error); 