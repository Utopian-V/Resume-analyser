import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

import {blogAuthors} from '../src/components/blogAuthors.mjs';





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topics = JSON.parse(fs.readFileSync(new URL('./blog_topics.json', import.meta.url), 'utf-8'));
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const NEON_DATABASE_URL = process.env.NEON_DATABASE_URL;

function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

function getPrompt(author, topic) {
  return `You are ${author.name}, a ${author.niche} expert. Write a 700-word blog post about "${topic}". 

IMPORTANT: Write the content using ONLY HTML tags, NOT markdown.

Use these HTML tags:
- <h2> for main sections (like "Key Strategies" or "Common Mistakes")
- <h3> for subsections
- <p> for paragraphs
- <ul> and <li> for bullet points
- <strong> for emphasis
- <em> for italics
- <code> for code snippets

Example format:
<h2>Introduction</h2>
<p>Start with an engaging introduction...</p>

<h2>Key Strategies</h2>
<p>Explain the main strategies...</p>
<ul>
<li>First strategy</li>
<li>Second strategy</li>
</ul>

<h2>Conclusion</h2>
<p>Wrap up with actionable advice...</p>

Include SEO keywords naturally: placement, internship, interview, resume, DSA, aptitude. Make it practical and actionable.`;
}

// Add markdown-to-HTML conversion as fallback
function convertMarkdownToHTML(content) {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li.*<\/li>)/s, '<ul>$1</ul>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    
    // Code
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>');
}

async function fetchUnsplashImage(query) {
  const url = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
  return url; // Unsplash random image URL
}

async function generateBlogPost(author, topic) {
  const prompt = getPrompt(author, topic);
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=' + GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    console.log('Fetch status:', response.status);
    const data = await response.json();
    console.log('Gemini API response:', data);
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return;
    }
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Blog content could not be generated.';
    
    // Convert markdown to HTML if needed (fallback)
    const formattedContent = content.includes('**') || content.includes('##') 
      ? convertMarkdownToHTML(content) 
      : content;
    
    const image = await fetchUnsplashImage(topic);
    const date = new Date().toISOString().slice(0, 10);
    const slug = `${date}-${author.name.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 60);
    
    // Insert into Neon (Postgres)
    const client = new Client({
      connectionString: NEON_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();
    await client.query(
      `INSERT INTO blogs (title, author, avatar, date, image, slug, content)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO NOTHING`,
      [topic, author.name, author.avatar, date, image, slug, formattedContent]
    );
    await client.end();
    console.log(`Blog post saved to Neon: ${slug}`);
  } catch (err) {
    console.error('Error in generateBlogPost:', err);
  }
}

function randomDelay(minMinutes, maxMinutes) {
  const ms = (Math.random() * (maxMinutes - minMinutes) + minMinutes) * 60 * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  for (const author of blogAuthors) {
    // Random delay between 0 and 60 minutes
    await randomDelay(0, 60);
    await generateBlogPost(author, getRandomTopic());
  }
})(); 