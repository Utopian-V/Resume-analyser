from fastapi import APIRouter, Request
from pydantic import BaseModel
import os
import requests
from datetime import datetime

# Use a safe, writable directory for blog generation
BLOG_DIR = os.path.join(os.path.dirname(__file__), '../generated_blogs')

try:
    os.makedirs(BLOG_DIR, exist_ok=True)
except Exception as e:
    print(f"Warning: Could not create BLOG_DIR {BLOG_DIR}: {e}")

router = APIRouter(prefix='/api/genai', tags=['genai'])

class BlogGenRequest(BaseModel):
    prompt: str
    author: dict
    topic: str

class BlogPublishRequest(BaseModel):
    content: str
    meta: dict = None

@router.post('/generate-blog')
async def generate_blog(req: BlogGenRequest):
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GEMINI_API_KEY}'
    payload = {
        "contents": [{"parts": [{"text": req.prompt}]}]
    }
    r = requests.post(url, json=payload)
    data = r.json()
    content = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Blog content could not be generated.')
    # Compose meta
    date = datetime.now().strftime('%Y-%m-%d')
    slug = f"{date}-{req.author['name'].lower().replace(' ', '-')}-{req.topic.lower().replace(' ', '-')}"[:60]
    meta = {
        'title': req.topic,
        'author': req.author['name'],
        'avatar': req.author['avatar'],
        'date': date,
        'image': f'https://source.unsplash.com/800x400/?{req.topic}',
        'slug': slug
    }
    return {"content": content, "meta": meta}

@router.post('/publish-blog')
async def publish_blog(req: BlogPublishRequest):
    meta = req.meta or {}
    meta_str = '\n'.join([f'{k}: "{v}"' for k, v in meta.items()])
    md = f"---\n{meta_str}\n---\n\n{req.content}"
    slug = meta.get('slug', f"blog-{datetime.now().strftime('%Y%m%d%H%M%S')}")
    path = os.path.join(BLOG_DIR, slug + '.md')
    with open(path, 'w') as f:
        f.write(md)
    return {"status": "ok", "slug": slug} 