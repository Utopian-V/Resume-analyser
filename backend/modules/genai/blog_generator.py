"""
Blog Generation Service
Handled by: AI/ML Team
Responsibilities: AI-powered blog content generation using Gemini
"""
import os
import aiohttp
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime
import asyncio

from core.database import db

# Configure logging
logger = logging.getLogger(__name__)

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
        
        # Blog authors with expertise
        self.blog_authors = [
            {
                'name': 'Sarah Chen',
                'niche': 'Career Development Expert',
                'avatar': 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            {
                'name': 'Michael Rodriguez',
                'niche': 'Technical Interview Coach',
                'avatar': 'https://randomuser.me/api/portraits/men/2.jpg'
            },
            {
                'name': 'Emily Watson',
                'niche': 'Resume Writing Specialist',
                'avatar': 'https://randomuser.me/api/portraits/women/3.jpg'
            },
            {
                'name': 'David Kim',
                'niche': 'DSA and Algorithm Expert',
                'avatar': 'https://randomuser.me/api/portraits/men/4.jpg'
            },
            {
                'name': 'Lisa Thompson',
                'niche': 'HR and Recruitment Specialist',
                'avatar': 'https://randomuser.me/api/portraits/women/5.jpg'
            },
            {
                'name': 'James Wilson',
                'niche': 'Aptitude Test Trainer',
                'avatar': 'https://randomuser.me/api/portraits/men/6.jpg'
            },
            {
                'name': 'Maria Garcia',
                'niche': 'Internship and Placement Coach',
                'avatar': 'https://randomuser.me/api/portraits/women/7.jpg'
            },
            {
                'name': 'Alex Johnson',
                'niche': 'Campus Placement Expert',
                'avatar': 'https://randomuser.me/api/portraits/men/8.jpg'
            }
        ]
    
    def _get_prompt(self, author: Dict, topic: str) -> str:
        """Generate prompt for blog content"""
        return f"""You are {author['name']}, a {author['niche']}. Write a 700-word blog post about "{topic}". 

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
    
    async def generate_blog_content(self, author: Dict, topic: str) -> str:
        """Generate blog content using Gemini API"""
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not set")
        
        prompt = self._get_prompt(author, topic)
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.base_url}?key={self.gemini_api_key}",
                json={"contents": [{"parts": [{"text": prompt}]}]},
                headers={"Content-Type": "application/json"}
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    raise Exception(f"Gemini API error: {response.status} - {error_text}")
                
                data = await response.json()
                
                if data.get('error'):
                    raise Exception(f"Gemini API error: {data['error']}")
                
                content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                
                if not content:
                    raise Exception("No content generated from Gemini API")
                
                return content
    
    async def get_random_image(self, topic: str) -> str:
        """Get a random image for the blog post"""
        # Use Unsplash random image API
        query = topic.replace(' ', '+')
        return f"https://source.unsplash.com/800x400/?{query}"
    
    async def generate_blog_post(self, author: Dict, topic: str) -> Dict:
        """Generate a single blog post"""
        try:
            logger.info(f"Generating blog post: '{topic}' by {author['name']}")
            
            # Generate content
            content = await self.generate_blog_content(author, topic)
            
            # Get image
            image = await self.get_random_image(topic)
            
            # Generate slug
            slug = f"{datetime.now().strftime('%Y-%m-%d')}-{author['name'].lower().replace(' ', '-')}-{topic.lower().replace(' ', '-').replace(':', '').replace(',', '').replace('.', '')}"
            slug = ''.join(c for c in slug if c.isalnum() or c == '-')
            slug = slug[:60]  # Limit length
            
            # Save to database
            blog_id = await self._save_blog_to_db(topic, author, content, image, slug)
            
            logger.info(f"Blog post generated successfully: {slug}")
            
            return {
                "id": blog_id,
                "title": topic,
                "author": author['name'],
                "slug": slug,
                "url": f"https://prepnexus.netlify.app/blog/{blog_id}"
            }
            
        except Exception as e:
            logger.error(f"Failed to generate blog post: {e}")
            raise
    
    async def generate_blogs(self, count: int = 4) -> List[Dict]:
        """Generate multiple blogs"""
        generated_blogs = []
        
        for i in range(count):
            try:
                author = self.blog_authors[i % len(self.blog_authors)]
                topic = self.blog_topics[i % len(self.blog_topics)]
                
                blog = await self.generate_blog_post(author, topic)
                generated_blogs.append(blog)
                
                # Small delay between generations
                await asyncio.sleep(1)
                
            except Exception as e:
                logger.error(f"Failed to generate blog {i+1}: {e}")
                continue
        
        return generated_blogs
    
    async def _save_blog_to_db(self, title: str, author: Dict, content: str, image: str, slug: str) -> int:
        """Save blog to database"""
        query = """
        INSERT INTO blogs (title, author, avatar, content, image, slug, tags, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        """
        
        tags = ['Career', 'Tips', 'Interview']
        date = datetime.now().strftime('%Y-%m-%d')
        
        return await db.fetchval(
            query, 
            title, 
            author['name'], 
            author['avatar'], 
            content, 
            image,
            slug,
            tags,
            date
        ) 