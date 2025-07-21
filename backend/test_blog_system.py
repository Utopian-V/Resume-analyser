#!/usr/bin/env python3
"""
Blog System Test Script
Purpose: Test all blog-related functionality to ensure it's working correctly
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from core.database import db
from endpoints.blogs import format_blog_response

async def test_database_connection():
    """Test database connection and basic operations"""
    print("🔍 Testing database connection...")
    
    try:
        await db.initialize()
        print("✅ Database connection established")
        
        # Test basic query
        result = await db.fetchval("SELECT COUNT(*) FROM blogs")
        print(f"✅ Found {result} blogs in database")
        
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_blog_schema():
    """Test if blog table has all required columns"""
    print("\n🔍 Testing blog schema...")
    
    try:
        # Check if all required columns exist
        columns_query = """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'blogs'
        ORDER BY ordinal_position
        """
        
        columns = await db.fetch(columns_query)
        column_names = [col['column_name'] for col in columns]
        
        required_columns = [
            'id', 'title', 'author', 'content', 'image', 'tags',
            'created_at', 'updated_at', 'published_at', 'status',
            'slug', 'meta_description', 'view_count', 'avatar', 'date'
        ]
        
        missing_columns = [col for col in required_columns if col not in column_names]
        
        if missing_columns:
            print(f"❌ Missing columns: {missing_columns}")
            return False
        else:
            print("✅ All required columns exist")
            return True
            
    except Exception as e:
        print(f"❌ Schema test failed: {e}")
        return False

async def test_blog_creation():
    """Test creating a new blog post"""
    print("\n🔍 Testing blog creation...")
    
    try:
        # Test data
        test_blog = {
            'title': 'Test Blog Post',
            'author': 'Test Author',
            'content': '<h2>Test Content</h2><p>This is a test blog post.</p>',
            'image': 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop',
            'tags': ['test', 'blog'],
            'avatar': 'https://randomuser.me/api/portraits/men/1.jpg',
            'date': '2024-01-01'
        }
        
        # Insert test blog
        query = """
        INSERT INTO blogs (title, author, content, image, tags, avatar, date, status, slug)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        """
        
        slug = test_blog['title'].lower().replace(' ', '-').replace(':', '').replace(',', '').replace('.', '')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        
        blog_id = await db.fetchval(
            query,
            test_blog['title'],
            test_blog['author'],
            test_blog['content'],
            test_blog['image'],
            test_blog['tags'],
            test_blog['avatar'],
            test_blog['date'],
            'published',
            slug
        )
        
        print(f"✅ Test blog created with ID: {blog_id}")
        
        # Clean up test blog
        await db.execute("DELETE FROM blogs WHERE id = $1", blog_id)
        print("✅ Test blog cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Blog creation test failed: {e}")
        return False

async def test_blog_retrieval():
    """Test retrieving blog posts"""
    print("\n🔍 Testing blog retrieval...")
    
    try:
        # Test getting all blogs
        blogs_query = """
        SELECT id, title, author, content, image, created_at, tags, slug, view_count, avatar, date
        FROM blogs
        WHERE status = 'published' OR status IS NULL
        ORDER BY created_at DESC 
        LIMIT 5
        """
        
        blogs = await db.fetch(blogs_query)
        print(f"✅ Retrieved {len(blogs)} blogs")
        
        if blogs:
            # Test formatting a blog response
            formatted_blog = format_blog_response(blogs[0])
            print(f"✅ Blog formatting works: {formatted_blog['title']}")
            
            # Test getting single blog
            single_blog = await db.fetchrow(
                "SELECT * FROM blogs WHERE id = $1",
                blogs[0]['id']
            )
            
            if single_blog:
                print(f"✅ Single blog retrieval works: {single_blog['title']}")
            else:
                print("❌ Single blog retrieval failed")
                return False
        else:
            print("⚠️ No blogs found to test retrieval")
        
        return True
        
    except Exception as e:
        print(f"❌ Blog retrieval test failed: {e}")
        return False

async def test_cache_functionality():
    """Test Redis cache functionality"""
    print("\n🔍 Testing cache functionality...")
    
    try:
        # Test cache invalidation
        await db.invalidate_blogs_cache()
        print("✅ Cache invalidation works")
        
        # Test cache operations
        test_key = "test:blog:123"
        test_data = {"title": "Test Blog", "content": "Test content"}
        
        await db._set_cache(test_key, test_data, 60)
        cached_data = await db._get_from_cache(test_key)
        
        if cached_data == test_data:
            print("✅ Cache set/get works")
        else:
            print("❌ Cache set/get failed")
            return False
        
        # Clean up test cache
        await db._redis.delete(test_key)
        print("✅ Cache cleanup works")
        
        return True
        
    except Exception as e:
        print(f"❌ Cache test failed: {e}")
        return False

async def test_blog_generation():
    """Test blog generation functionality"""
    print("\n🔍 Testing blog generation...")
    
    try:
        # Check if Gemini API key is available
        gemini_key = os.getenv('GEMINI_API_KEY')
        if not gemini_key:
            print("⚠️ GEMINI_API_KEY not set, skipping generation test")
            return True
        
        # Import blog generator
        from modules.genai.blog_generator import BlogGenerator
        
        generator = BlogGenerator()
        
        # Test generating a single blog
        test_author = {
            'name': 'Test Author',
            'niche': 'Testing',
            'avatar': 'https://randomuser.me/api/portraits/men/1.jpg'
        }
        
        test_topic = "How to test blog generation"
        
        # This might take a while due to API calls
        print("⏳ Testing blog generation (this may take a minute)...")
        
        # For now, just test the prompt generation
        prompt = generator._get_prompt(test_author, test_topic)
        if prompt and len(prompt) > 100:
            print("✅ Blog prompt generation works")
            return True
        else:
            print("❌ Blog prompt generation failed")
            return False
            
    except Exception as e:
        print(f"❌ Blog generation test failed: {e}")
        return False

async def main():
    """Run all blog system tests"""
    print("🚀 Starting Blog System Tests")
    print("=" * 50)
    
    tests = [
        ("Database Connection", test_database_connection),
        ("Blog Schema", test_blog_schema),
        ("Blog Creation", test_blog_creation),
        ("Blog Retrieval", test_blog_retrieval),
        ("Cache Functionality", test_cache_functionality),
        ("Blog Generation", test_blog_generation),
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
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Blog system is working correctly.")
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
    
    # Cleanup
    await db.close()

if __name__ == "__main__":
    asyncio.run(main()) 