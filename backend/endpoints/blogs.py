from fastapi import APIRouter, HTTPException
from typing import List, Optional
import os
import asyncpg
import json
from datetime import datetime

router = APIRouter(prefix="/blogs", tags=["blogs"])

async def get_db_connection():
    """Get database connection to Neon"""
    try:
        connection_string = os.getenv('NEON_DATABASE_URL')
        if not connection_string:
            raise HTTPException(status_code=500, detail="Database connection string not configured")
        
        conn = await asyncpg.connect(connection_string)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@router.get("/")
async def get_blogs(limit: Optional[int] = 50, offset: Optional[int] = 0):
    """
    Fetch blogs from Neon database with pagination
    """
    try:
        conn = await get_db_connection()
        
        # Query to get blogs with pagination, ordered by created_at desc
        query = """
        SELECT id, title, author_name, author_avatar, author_bio, 
               content, summary, tags, image_url, created_at, slug
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        """
        
        rows = await conn.fetch(query, limit, offset)
        await conn.close()
        
        blogs = []
        for row in rows:
            # Parse tags from JSON string
            tags = json.loads(row['tags']) if row['tags'] else []
            
            blog = {
                "id": row['id'],
                "title": row['title'],
                "author": {
                    "name": row['author_name'],
                    "slug": row['slug'],
                    "bio": row['author_bio'],
                    "avatar": row['author_avatar']
                },
                "date": row['created_at'].strftime('%Y-%m-%d'),
                "summary": row['summary'],
                "content": row['content'],
                "image": row['image_url'],
                "tags": tags
            }
            blogs.append(blog)
        
        return {
            "blogs": blogs,
            "total": len(blogs),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch blogs: {str(e)}")

@router.get("/count")
async def get_blog_count():
    """
    Get total count of blogs in database
    """
    try:
        conn = await get_db_connection()
        
        query = "SELECT COUNT(*) as count FROM blogs"
        result = await conn.fetchval(query)
        await conn.close()
        
        return {"total_blogs": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get blog count: {str(e)}")

@router.get("/featured")
async def get_featured_blogs(limit: int = 5):
    """
    Get featured/recent blogs for the hero section
    """
    try:
        conn = await get_db_connection()
        
        query = """
        SELECT id, title, author_name, author_avatar, author_bio, 
               content, summary, tags, image_url, created_at, slug
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT $1
        """
        
        rows = await conn.fetch(query, limit)
        await conn.close()
        
        blogs = []
        for row in rows:
            tags = json.loads(row['tags']) if row['tags'] else []
            
            blog = {
                "id": row['id'],
                "title": row['title'],
                "author": {
                    "name": row['author_name'],
                    "slug": row['slug'],
                    "bio": row['author_bio'],
                    "avatar": row['author_avatar']
                },
                "date": row['created_at'].strftime('%Y-%m-%d'),
                "summary": row['summary'],
                "content": row['content'],
                "image": row['image_url'],
                "tags": tags
            }
            blogs.append(blog)
        
        return {"featured_blogs": blogs}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch featured blogs: {str(e)}") 