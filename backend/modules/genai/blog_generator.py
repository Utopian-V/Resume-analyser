"""
Blog Generation Service
Handled by: AI/ML Team
Responsibilities: AI-powered blog content generation using Gemini
"""
import os
import aiohttp
import json
from typing import Dict, List, Optional
from datetime import datetime

from backend.core.database import db

class BlogGenerator:
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.base_url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"
        
        # Blog topics for generation
        self.blog_topics = [
            "How to crack campus placements in 2024",
            "Top 10 aptitude questions for tech interviews", 
            "How to answer 'Tell me about yourself' in interviews",
            "Best resume tips for freshers",
            "How to get an internship at a top tech company",
            "Most common HR interview questions and answers",
            "How to prepare for data interpretation rounds",
            "Top DSA questions for FAANG interviews",
            "How to negotiate your first salary",
            "Mistakes to avoid in online assessments",
            "How to get referrals for jobs and internships",
            "Behavioral interview questions and how to answer them",
            "How to build a project portfolio as a student",
            "What recruiters look for in a resume",
            "How to ace group discussions in placements"
        ]
        
        # Blog authors with personalities
        self.blog_authors = [
            {
                "name": "Priya Patel",
                "avatar": "https://randomuser.me/api/portraits/women/65.jpg",
                "niche": "HR and interview tips, practical advice for freshers"
            },
            {
                "name": "Ravi Kumar", 
                "avatar": "https://randomuser.me/api/portraits/men/29.jpg",
                "niche": "DSA, coding, and technical interview strategies"
            },
            {
                "name": "Sara Lee",
                "avatar": "https://randomuser.me/api/portraits/women/68.jpg", 
                "niche": "Internship guidance, resume building, and career growth"
            },
            {
                "name": "Alex Kim",
                "avatar": "https://randomuser.me/api/portraits/men/45.jpg",
                "niche": "Behavioral interviews, soft skills, and workplace culture"
            }
        ]
    
    async def generate_blog_content(self, author: Dict, topic: str) -> str:
        """Generate blog content using Gemini API"""
        try:
            if not self.gemini_api_key:
                return self._get_fallback_content(topic)
            
            prompt = self._create_prompt(author, topic)
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f'{self.base_url}?key={self.gemini_api_key}',
                    json={"contents": [{"parts": [{"text": prompt}]}]},
                    headers={'Content-Type': 'application/json'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                        
                        # Convert markdown to HTML if needed
                        if '**' in content or '##' in content:
                            content = self._convert_markdown_to_html(content)
                        
                        return content
                    else:
                        return self._get_fallback_content(topic)
                        
        except Exception as e:
            return self._get_fallback_content(topic, str(e))
    
    def _create_prompt(self, author: Dict, topic: str) -> str:
        """Create prompt for Gemini API"""
        return f"""You are {author['name']}, a {author['niche']} expert. Write a 700-word blog post about "{topic}". 

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

Include SEO keywords naturally: placement, internship, interview, resume, DSA, aptitude. Make it practical and actionable."""
    
    def _convert_markdown_to_html(self, content: str) -> str:
        """Convert markdown to HTML"""
        return content.replace('**', '<strong>').replace('**', '</strong>').replace('##', '<h2>').replace('###', '<h3>')
    
    def _get_fallback_content(self, topic: str, error: str = None) -> str:
        """Get fallback content when API fails"""
        return f"<h2>{topic}</h2><p>Blog content placeholder. {error or 'Gemini API not configured.'}</p>"
    
    async def get_random_image(self, topic: str) -> str:
        """Get random image from Unsplash"""
        try:
            return f"https://source.unsplash.com/800x400/?{topic.replace(' ', '+')}"
        except:
            return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
    
    async def generate_blogs(self, count: int = 4) -> List[Dict]:
        """Generate multiple blogs"""
        generated_blogs = []
        
        for i in range(count):
            author = self.blog_authors[i % len(self.blog_authors)]
            topic = self.blog_topics[i % len(self.blog_topics)]
            
            # Generate content
            content = await self.generate_blog_content(author, topic)
            image = await self.get_random_image(topic)
            
            # Save to database
            blog_id = await self._save_blog_to_db(topic, author, content, image)
            
            generated_blogs.append({
                "id": blog_id,
                "title": topic,
                "author": author['name'],
                "url": f"https://prepnexus.netlify.app/blog/{blog_id}"
            })
        
        return generated_blogs
    
    async def _save_blog_to_db(self, title: str, author: Dict, content: str, image: str) -> int:
        """Save blog to database"""
        query = """
        INSERT INTO blogs (title, author, avatar, content, image, created_at, date, tags)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6)
        RETURNING id
        """
        
        tags = json.dumps(["Career", "Tips", "Interview"])
        
        return await db.fetchval(query, 
            title, 
            author['name'], 
            author['avatar'], 
            content, 
            image,
            tags
        ) 