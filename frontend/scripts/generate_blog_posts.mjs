import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { blogAuthors } from '../src/components/blogAuthors.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topics = JSON.parse(fs.readFileSync(new URL('./blog_topics.json', import.meta.url), 'utf-8'));
const BLOG_DIR = path.join(__dirname, '../src/generated_blogs');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

function getRandomTopic() {
  return topics[Math.floor(Math.random() * topics.length)];
}

function getPrompt(author, topic) {
  return `Write a 700-word blog post in the style of ${author.name}, whose niche is: ${author.niche}. Topic: "${topic}". Include SEO keywords: placement, internship, interview, resume, DSA, aptitude. Add a friendly intro, practical tips, and a conclusion. Format as Markdown.`;
}

async function fetchUnsplashImage(query) {
  const url = `https://source.unsplash.com/800x400/?${encodeURIComponent(query)}`;
  return url; // Unsplash random image URL
}

async function generateBlogPost(author, topic) {
  // Call Gemini Pro API (pseudo-code, replace with actual API call)
  const prompt = getPrompt(author, topic);
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Blog content could not be generated.';
  const image = await fetchUnsplashImage(topic);
  const date = new Date().toISOString().slice(0, 10);
  const slug = `${date}-${author.name.toLowerCase().replace(/\s+/g, '-')}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`.slice(0, 60);
  const meta = `---\ntitle: "${topic}"\nauthor: "${author.name}"\navatar: "${author.avatar}"\ndate: "${date}"\nimage: "${image}"\nslug: "${slug}"\n---\n`;
  fs.writeFileSync(path.join(BLOG_DIR, slug + '.md'), meta + '\n' + content);
  console.log(`Blog post generated: ${slug}`);
}

(async () => {
  for (const author of blogAuthors) {
    const topic = getRandomTopic();
    await generateBlogPost(author, topic);
  }
})(); 