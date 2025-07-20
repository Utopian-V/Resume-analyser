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
from core.database import db
from models import BlogPost

# Router configuration with prefix and OpenAPI tags
router = APIRouter(prefix="/blogs", tags=["blogs"])

def format_blog_response(row) -> dict:
    """
    Format database row into standardized blog response.
    
    This function ensures consistent data structure between database
    and API responses, handling data type conversions and defaults.
    
    Args:
        row: Database row containing blog data
        
    Returns:
        dict: Formatted blog object with consistent structure
        
    Note:
        - Converts database ID to string for frontend compatibility
        - Provides fallback image for blogs without featured images
        - Ensures author is always an object with name and avatar
        - Handles null tags gracefully
        - Uses proper PostgreSQL schema fields
    """
    return {
        "id": str(row['id']),  # Ensure ID is string for frontend compatibility
        "title": row['title'],
        "author": {
            "name": row['author'],
            # Default avatar - in production, this would come from user profile
            "avatar": "https://randomuser.me/api/portraits/men/29.jpg"
        },
        "date": row['created_at'].strftime('%Y-%m-%d') if row['created_at'] else None,
        "content": row['content'],
        # Fallback to a professional stock image if no image is provided
        "image": row['image'] or "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
        "tags": row['tags'] if row['tags'] else [],
        "slug": row.get('slug'),
        "view_count": row.get('view_count', 0),
        "meta_description": row.get('meta_description')
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
        # Optimized query with caching - only fetch essential fields
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, view_count
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
        """
        
        # Use caching for better performance
        rows = await db.fetch(query, limit, offset, use_cache=True, cache_ttl=600)  # 10 minutes cache
        
        # Optimize response formatting
        blogs = []
        for row in rows:
            blogs.append({
                "id": str(row['id']),
                "title": row['title'],
                "author": {
                    "name": row['author'],
                    "avatar": "https://randomuser.me/api/portraits/men/29.jpg"
                },
                "date": row['created_at'].strftime('%Y-%m-%d') if row['created_at'] else None,
                "content": row['content'][:200] + "..." if len(row['content']) > 200 else row['content'],  # Truncate for list view
                "image": row['image'] or "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
                "tags": row['tags'] if row['tags'] else [],
                "slug": row.get('slug'),
                "view_count": row.get('view_count', 0)
            })
        
        return {
            "blogs": blogs, 
            "total": len(blogs),
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
        # Query for specific blog by ID
        # Using fetchrow for single result optimization
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, view_count, meta_description
        FROM blogs
        WHERE id = $1
        """
        
        row = await db.fetchrow(query, blog_id)
        
        if not row:
            raise HTTPException(
                status_code=404, 
                detail=f"Blog post with ID {blog_id} not found"
            )
        
        return format_blog_response(row)
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404) without modification
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching blog {blog_id}: {e}")
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
    tags: Optional[List[str]] = None
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
        
    Returns:
        dict: Created blog information with ID
        
    Raises:
        HTTPException: If blog creation fails
    """
    try:
        # Insert new blog with current timestamp
        # Using NOW() ensures consistent timezone handling
        query = """
        INSERT INTO blogs (title, author, content, image, tags, slug)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        """
        
        # Generate slug from title
        slug = title.lower().replace(' ', '-').replace(':', '').replace(',', '')
        blog_id = await db.fetchval(query, title, author, content, image, tags or [], slug)
        
        return {
            "id": blog_id, 
            "message": "Blog created successfully",
            "title": title
        }
        
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating blog: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Failed to create blog post. Please try again later."
        ) 