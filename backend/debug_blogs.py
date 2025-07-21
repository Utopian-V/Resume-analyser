#!/usr/bin/env python3
"""
Debug script for blog endpoints
Purpose: Identify the exact cause of 500 errors in blog endpoints
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def test_database_connection():
    """Test basic database connection"""
    print("🔍 Testing database connection...")
    
    try:
        from core.database import db
        await db.initialize()
        
        # Test simple query
        result = await db.fetchval("SELECT COUNT(*) FROM blogs")
        print(f"✅ Database connection successful. Found {result} blogs.")
        
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_blog_query():
    """Test the exact query used in blog endpoint"""
    print("\n🔍 Testing blog query...")
    
    try:
        from core.database import db
        
        query = """
        SELECT id, title, author, content, image, created_at, tags, slug, avatar, date
        FROM blogs
        ORDER BY created_at DESC 
        LIMIT 20 OFFSET 0
        """
        
        rows = await db.fetch(query)
        print(f"✅ Blog query successful. Retrieved {len(rows)} blogs.")
        
        if rows:
            print(f"✅ First blog: {rows[0]['title']}")
        
        return True
    except Exception as e:
        print(f"❌ Blog query failed: {e}")
        return False

async def test_blog_generator_import():
    """Test if blog generator can be imported"""
    print("\n🔍 Testing blog generator import...")
    
    try:
        from modules.genai.blog_generator import BlogGenerator
        generator = BlogGenerator()
        print("✅ Blog generator import successful.")
        return True
    except Exception as e:
        print(f"❌ Blog generator import failed: {e}")
        return False

async def test_redis_connection():
    """Test Redis connection"""
    print("\n🔍 Testing Redis connection...")
    
    try:
        from core.redis_manager import redis_manager
        await redis_manager.initialize()
        
        if redis_manager.is_connected():
            print("✅ Redis connection successful.")
            return True
        else:
            print("⚠️ Redis connection failed, but continuing...")
            return True  # Redis is optional
    except Exception as e:
        print(f"⚠️ Redis connection failed: {e}, but continuing...")
        return True  # Redis is optional

async def test_schema():
    """Test if blog table has required columns"""
    print("\n🔍 Testing blog schema...")
    
    try:
        from core.database import db
        
        # Check if blogs table exists
        table_exists = await db.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'blogs'
            )
        """)
        
        if not table_exists:
            print("❌ Blogs table does not exist!")
            return False
        
        # Check columns
        columns_query = """
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'blogs'
        ORDER BY ordinal_position
        """
        
        columns = await db.fetch(columns_query)
        column_names = [col['column_name'] for col in columns]
        
        print(f"✅ Blogs table exists with {len(columns)} columns:")
        for col in columns:
            print(f"  - {col['column_name']}: {col['data_type']}")
        
        # Check for required columns
        required = ['id', 'title', 'author', 'content']
        missing = [col for col in required if col not in column_names]
        
        if missing:
            print(f"❌ Missing required columns: {missing}")
            return False
        
        return True
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

async def main():
    """Run all debug tests"""
    print("🚀 Starting Blog System Debug")
    print("=" * 50)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Blog Schema", test_schema),
        ("Blog Query", test_blog_query),
        ("Redis Connection", test_redis_connection),
        ("Blog Generator Import", test_blog_generator_import),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Debug Results Summary")
    print("=" * 50)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    # Cleanup
    try:
        from core.database import db
        await db.close()
    except:
        pass

if __name__ == "__main__":
    asyncio.run(main()) 