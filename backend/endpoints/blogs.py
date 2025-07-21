"""
Blog Management Endpoints
Handled by: Backend Team
Purpose: Handle blog CRUD operations and content management

This module provides RESTful API endpoints for blog management including:
- Fetching blog listings with pagination
- Retrieving individual blog posts
- Creating new blog content
- SEO-friendly URL structure for blog posts
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging
from core.database import db
from models import BlogPost
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

# Router configuration with prefix and OpenAPI tags
router = APIRouter(prefix="/blogs", tags=["blogs"])

def format_blog_response(row) -> dict:
    """
    Format database row into standardized blog response.
    Handles both datetime and string for date fields.
    """
    date_value = row.get('date', row['created_at'])
    date_str = None
    if date_value:
        if isinstance(date_value, str):
            try:
                # Try parsing the string to a datetime object
                parsed_date = datetime.fromisoformat(date_value)
                date_str = parsed_date.strftime('%Y-%m-%d')
            except ValueError:
                # Fallback: assume it's already a date string like 'YYYY-MM-DD...'
                date_str = date_value[:10]
        elif hasattr(date_value, 'strftime'):
            date_str = date_value.strftime('%Y-%m-%d')
        else:
            date_str = str(date_value)[:10]   # crude YYYY-MM-DD fallback
    

    return {
        "id": str(row['id']),
        "title": row['title'],
        "author": {
            "name": row['author'],
            "avatar": row.get('avatar') or "https://randomuser.me/api/portraits/men/29.jpg"
        },
        "date": date_str,
        "content": row['content'][:100] + "...",
        "image": row['image'] or "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
        "tags": row['tags'] if row['tags'] else [],
        "slug": row.get('slug'),
        "view_count": 0,  # Default since column doesn't exist in current schema
        "meta_description": None  # Default since column doesn't exist in current schema
    }

@router.get("/")
async def get_blogs(
    limit: Optional[int] = Query(20, ge=1, le=50, description="Number of blogs to return"),
    offset: Optional[int] = Query(0, ge=0, description="Number of blogs to skip")
):
    """
    Get paginated list of blog posts (optimized for performance).
    
    Returns a list of blog posts ordered by creation date (newest first).
    Uses intelligent caching and optimized queries for maximum performance.
    
    Args:
        limit: Maximum number of blogs to return (1-50, optimized for frontend)
        offset: Number of blogs to skip for pagination
        
    Returns:
        dict: Object containing blogs array and total count
        
    Raises:
        HTTPException: If database query fails
    """
    try:
        # Optimized query with caching - only fetch essential fields that exist
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, avatar, date
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        """
        
        # Use caching for better performance
        rows = await db.fetch(query, limit, offset, use_cache=True, cache_ttl=600)  # 10 minutes cache
        
        # Optimize response formatting
        blogs = []
        for row in rows:
            blogs.append(format_blog_response(row))
        
        # Get total count for pagination
        count_query = """
        SELECT COUNT(*) as total
        FROM blogs
        """
        total_result = await db.fetchrow(count_query, use_cache=True, cache_ttl=600)
        total = total_result['total'] if total_result else len(blogs)
        
        return {
            "blogs": blogs, 
            "total": total,
            "limit": limit,
            "offset": offset,
            "cached": True  # Indicate if response was cached
        }
        
    except Exception as e:
        logger.error(f"Error fetching blogs: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch blogs. Please try again later."
        )



@router.get("/{blog_id}")
async def get_blog_by_id(blog_id: int):
    """
    Get a specific blog post by ID.
    
    Retrieves a single blog post with all its content and metadata.
    Used for individual blog post pages and detailed views.
    
    Args:
        blog_id: Unique identifier of the blog post
        
    Returns:
        dict: Complete blog post data
        
    Raises:
        HTTPException: If blog not found or database error occurs
    """
    try:
        # Query for specific blog by ID - only select columns that exist
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, avatar, date
        FROM blogs
        WHERE id = $1
        """
        
        row = await db.fetchrow(query, blog_id)
        
        if not row:
            raise HTTPException(
                status_code=404, 
                detail=f"Blog post with ID {blog_id} not found"
            )
        
        # Try to increment view count if the column exists
        try:
            await db.execute(
                "UPDATE blogs SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1",
                blog_id
            )
        except Exception as e:
            logger.warning(f"Failed to increment view count for blog {blog_id}: {e}")
        
        return format_blog_response(row)
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404) without modification
        raise
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error fetching blog {blog_id}: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch blog post. Please try again later."
        )

@router.post("/")
async def create_blog(
    title: str,
    author: str, 
    content: str, 
    image: Optional[str] = None,
    tags: Optional[List[str]] = None,
    avatar: Optional[str] = None,
    date: Optional[str] = None
):
    """
    Create a new blog post.
    
    Creates a new blog entry in the database with the provided content.
    This endpoint is typically used by admin users or content creators.
    
    Args:
        title: Blog post title
        author: Author name
        content: Blog content (HTML format supported)
        image: Optional featured image URL
        tags: Optional list of tags for categorization
        avatar: Optional author avatar URL
        date: Optional publication date (YYYY-MM-DD format)
        
    Returns:
        dict: Created blog information with ID
        
    Raises:
        HTTPException: If blog creation fails
    """
    try:
        # Insert new blog with current timestamp
        # Using NOW() ensures consistent timezone handling
        query = """
        INSERT INTO blogs (title, author, content, image, tags, slug, avatar, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        """
        
        # Generate slug from title
        slug = title.lower().replace(' ', '-').replace(':', '').replace(',', '').replace('.', '')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        blog_id = await db.fetchval(
            query, 
            title, 
            author, 
            content, 
            image, 
            tags or [], 
            slug,
            avatar,
            date
        )
        
        # Invalidate cache
        await db.invalidate_blogs_cache()
        
        return {
            "id": blog_id, 
            "message": "Blog created successfully",
            "title": title,
            "slug": slug
        }
        
    except Exception as e:
        # Log the error for debugging
        logger.error(f"Error creating blog: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to create blog post. Please try again later."
        )

@router.get("/slug/{slug}")
async def get_blog_by_slug(slug: str):
    """
    Get a specific blog post by slug.
    
    Retrieves a single blog post using its SEO-friendly slug.
    Used for SEO-optimized URLs.
    
    Args:
        slug: SEO-friendly slug of the blog post
        
    Returns:
        dict: Complete blog post data
        
    Raises:
        HTTPException: If blog not found or database error occurs
    """
    try:
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, avatar, date
        FROM blogs
        WHERE slug = $1
        """
        
        row = await db.fetchrow(query, slug)
        
        if not row:
            raise HTTPException(
                status_code=404, 
                detail=f"Blog post with slug '{slug}' not found"
            )
        
        # Try to increment view count if the column exists
        try:
            await db.execute(
                "UPDATE blogs SET view_count = COALESCE(view_count, 0) + 1 WHERE slug = $1",
                slug
            )
        except Exception as e:
            logger.warning(f"Failed to increment view count for blog {slug}: {e}")
        
        return format_blog_response(row)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching blog by slug {slug}: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch blog post. Please try again later."
        ) 

@router.post("/generate")
async def generate_blogs():
    """
    Generate new blog posts using AI.
    
    This endpoint triggers the blog generation process using the Gemini API.
    It creates multiple blog posts with different topics and authors.
    
    Returns:
        dict: Generation status and results
        
    Raises:
        HTTPException: If generation fails
    """
    try:
        # Import the blog generator
        from modules.genai.blog_generator import BlogGenerator
        
        generator = BlogGenerator()
        
        # Generate 4 new blogs
        generated_blogs = await generator.generate_blogs(count=4)
        
        # Invalidate cache
        await db.invalidate_blogs_cache()
        
        return {
            "success": True,
            "message": f"Successfully generated {len(generated_blogs)} blog posts",
            "blogs": generated_blogs
        }
        
    except Exception as e:
        logger.error(f"Error generating blogs: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate blog posts. Please try again later."
        ) 

@router.get("/debug")
async def debug_blogs():
    """
    Debug endpoint to test database connection and schema.
    """
    try:
        # Test basic database connection
        await db.execute("SELECT 1")
        
        # Check if blogs table exists
        table_check = await db.fetch("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'blogs'
            )
        """)
        
        if not table_check[0]['exists']:
            return {"error": "Blogs table does not exist"}
        
        # Check table schema
        schema = await db.fetch("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'blogs' 
            ORDER BY ordinal_position
        """)
        
        # Count blogs
        count = await db.fetchval("SELECT COUNT(*) FROM blogs")
        
        return {
            "status": "ok",
            "table_exists": True,
            "blog_count": count,
            "schema": [{"column": row['column_name'], "type": row['data_type']} for row in schema]
        }
        
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__} 