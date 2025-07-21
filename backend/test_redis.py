#!/usr/bin/env python3
"""
Redis Integration Test
Purpose: Test Redis connection and functionality
"""
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_redis():
    """Test Redis connection and basic operations"""
    print("🔍 Testing Redis Integration...")
    
    try:
        from core.redis_manager import redis_manager
        
        # Initialize Redis
        await redis_manager.initialize()
        print(f"✅ Redis connection: {redis_manager.is_connected()}")
        
        if not redis_manager.is_connected():
            print("❌ Redis connection failed")
            return False
        
        # Test basic operations
        print("\n🔍 Testing Redis operations...")
        
        # Test set/get
        test_data = {"test": "data", "number": 123}
        await redis_manager.set("test_key", test_data, 60)
        print("✅ Set operation successful")
        
        result = await redis_manager.get("test_key")
        print(f"✅ Get operation successful: {result}")
        
        if result == test_data:
            print("✅ Data integrity verified")
        else:
            print("❌ Data integrity failed")
            return False
        
        # Test delete
        await redis_manager.delete("test_key")
        deleted_result = await redis_manager.get("test_key")
        if deleted_result is None:
            print("✅ Delete operation successful")
        else:
            print("❌ Delete operation failed")
            return False
        
        # Test cache stats
        stats = redis_manager.get_cache_stats()
        print(f"✅ Cache stats: {stats}")
        
        # Test health check
        health = await redis_manager.health_check()
        print(f"✅ Health check: {health}")
        
        # Cleanup
        await redis_manager.close()
        print("✅ Redis test completed successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Redis test failed: {e}")
        return False

async def test_database_with_redis():
    """Test database operations with Redis caching"""
    print("\n🔍 Testing Database with Redis caching...")
    
    try:
        from core.database import db
        
        # Initialize database (which includes Redis)
        await db.initialize()
        print("✅ Database with Redis initialized")
        
        # Test a simple query with caching
        result1 = await db.fetch("SELECT COUNT(*) FROM blogs", use_cache=True)
        print(f"✅ First query (with cache): {result1}")
        
        result2 = await db.fetch("SELECT COUNT(*) FROM blogs", use_cache=True)
        print(f"✅ Second query (should be cached): {result2}")
        
        # Test cache invalidation
        await db.invalidate_blogs_cache()
        print("✅ Cache invalidation successful")
        
        # Cleanup
        await db.close()
        print("✅ Database with Redis test completed")
        
        return True
        
    except Exception as e:
        print(f"❌ Database with Redis test failed: {e}")
        return False

async def main():
    """Run all Redis tests"""
    print("🚀 Starting Redis Integration Tests")
    print("=" * 50)
    
    # Check environment variables
    redis_url = os.getenv('REDIS_URL')
    print(f"🔍 Redis URL: {'✅ Set' if redis_url else '❌ Not set'}")
    
    if redis_url:
        print(f"🔍 Redis URL preview: {redis_url[:30]}...")
    
    tests = [
        ("Redis Connection", test_redis),
        ("Database with Redis", test_database_with_redis),
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
    print("📊 Redis Test Results Summary")
    print("=" * 50)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")

if __name__ == "__main__":
    asyncio.run(main()) 