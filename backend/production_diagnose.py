#!/usr/bin/env python3
"""
Production Performance Diagnostic
Purpose: Check performance in production environment (Render)

This script will:
1. Test database connection performance
2. Check if Redis is available
3. Measure query performance
4. Identify production bottlenecks
"""
import asyncio
import time
import os
import json
from core.database import db

async def test_production_performance():
    """Test performance in production environment"""
    print("🚀 Production Performance Diagnostic")
    print("=" * 50)
    
    # Check environment
    print("🔧 Environment Check:")
    print(f"  NEON_DATABASE_URL: {'✅ Set' if os.getenv('NEON_DATABASE_URL') else '❌ Missing'}")
    print(f"  REDIS_URL: {'✅ Set' if os.getenv('REDIS_URL') else '❌ Missing'}")
    print(f"  ENVIRONMENT: {os.getenv('ENVIRONMENT', 'development')}")
    
    try:
        # Initialize database
        print("\n🔗 Testing Database Connection...")
        start_time = time.time()
        await db.initialize()
        init_time = (time.time() - start_time) * 1000
        print(f"  Database initialization: {init_time:.2f}ms")
        
        # Test basic query
        print("\n📊 Testing Query Performance...")
        start_time = time.time()
        result = await db.fetch("SELECT COUNT(*) FROM blogs", use_cache=False)
        query_time = (time.time() - start_time) * 1000
        print(f"  Basic query: {query_time:.2f}ms")
        
        # Test cached query
        start_time = time.time()
        result = await db.fetch("SELECT COUNT(*) FROM blogs", use_cache=True)
        cached_time = (time.time() - start_time) * 1000
        print(f"  Cached query: {cached_time:.2f}ms")
        
        # Test cached query again
        start_time = time.time()
        result = await db.fetch("SELECT COUNT(*) FROM blogs", use_cache=True)
        cached_again_time = (time.time() - start_time) * 1000
        print(f"  Second cached query: {cached_again_time:.2f}ms")
        
        # Test blog listing query
        print("\n📝 Testing Blog Listing Performance...")
        start_time = time.time()
        blogs = await db.fetch("SELECT id, title, author FROM blogs WHERE status = 'published' LIMIT 10", use_cache=True)
        blogs_time = (time.time() - start_time) * 1000
        print(f"  Blog listing query: {blogs_time:.2f}ms")
        print(f"  Blogs found: {len(blogs)}")
        
        # Get health report
        print("\n🏥 Database Health Report:")
        health = await db.get_health_report()
        print(f"  Status: {health['status']}")
        print(f"  Active connections: {health['performance']['active_connections']}")
        print(f"  Total connections: {health['performance']['total_connections']}")
        print(f"  Cache available: {health['performance']['cache_available']}")
        
        await db.close()
        
        # Performance analysis
        print("\n📈 Performance Analysis:")
        if init_time > 1000:
            print("  ❌ Database initialization is slow (>1s)")
        elif init_time > 500:
            print("  ⚠️ Database initialization is moderately slow (500ms-1s)")
        else:
            print("  ✅ Database initialization is fast (<500ms)")
        
        if query_time > 200:
            print("  ❌ Database queries are slow (>200ms)")
        elif query_time > 100:
            print("  ⚠️ Database queries are moderately slow (100-200ms)")
        else:
            print("  ✅ Database queries are fast (<100ms)")
        
        if not health['performance']['cache_available']:
            print("  ❌ Redis cache is not available - this will cause slow performance")
            print("  💡 Recommendation: Add Redis service to production")
        else:
            cache_speedup = query_time / cached_again_time if cached_again_time > 0 else 1
            if cache_speedup > 2:
                print(f"  ✅ Caching is working well ({cache_speedup:.1f}x speedup)")
            else:
                print("  ⚠️ Caching is not providing significant speedup")
        
        # Production recommendations
        print("\n🎯 Production Recommendations:")
        if not health['performance']['cache_available']:
            print("  1. 🚨 CRITICAL: Add Redis service to production")
            print("     - This will provide 5-20x performance improvement")
            print("     - Add REDIS_URL to Render environment variables")
        
        if init_time > 500:
            print("  2. ⚠️ Consider optimizing database connection")
            print("     - Check Neon region proximity to your users")
            print("     - Consider connection pooling settings")
        
        if query_time > 100:
            print("  3. ⚠️ Consider query optimization")
            print("     - Add database indexes for common queries")
            print("     - Optimize query patterns")
        
        print("\n✅ Production diagnostic completed!")
        
    except Exception as e:
        print(f"❌ Production diagnostic failed: {e}")
        print("💡 This might indicate:")
        print("   - Database connection issues")
        print("   - Missing environment variables")
        print("   - Network connectivity problems")

if __name__ == "__main__":
    asyncio.run(test_production_performance()) 