#!/usr/bin/env python3
"""
Test Blog Query
Purpose: Test the exact query used in blog endpoints
"""
import asyncio
from core.database import db

async def test_blog_query():
    """Test the blog query used in endpoints"""
    print("🔍 Testing Blog Query...")
    
    try:
        await db.initialize()
        
        # Test the exact query from the blog endpoint
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, avatar, date
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT 5
        """
        
        result = await db.fetch(query)
        print(f"✅ Query successful! Found {len(result)} blogs")
        
        if result:
            print(f"📝 First blog: {result[0]['title']}")
            print(f"👤 Author: {result[0]['author']}")
            print(f"📅 Date: {result[0]['date']}")
        
        await db.close()
        return True
        
    except Exception as e:
        print(f"❌ Query failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_blog_query()) 