#!/usr/bin/env python3
"""
Redis Setup and Configuration Script
Handled by: DevOps Team
Purpose: Redis integration testing and configuration

This script helps:
- Test Redis connection and configuration
- Set up initial cache data
- Validate Redis performance
- Provide setup instructions
"""
import asyncio
import os
import time
from dotenv import load_dotenv
from core.redis_manager import redis_manager

# Load environment variables
load_dotenv()

async def test_redis_connection():
    """Test Redis connection and basic operations"""
    print("🔧 Testing Redis Connection...")
    print("=" * 50)
    
    # Check environment variables
    redis_url = os.getenv('REDIS_URL')
    redis_host = os.getenv('REDIS_HOST', 'localhost')
    redis_port = os.getenv('REDIS_PORT', '6379')
    
    print(f"📋 Environment Check:")
    print(f"  REDIS_URL: {'✅ Set' if redis_url else '❌ Missing'}")
    print(f"  REDIS_HOST: {redis_host}")
    print(f"  REDIS_PORT: {redis_port}")
    
    # Initialize Redis
    print(f"\n🚀 Initializing Redis...")
    start_time = time.time()
    await redis_manager.initialize()
    init_time = (time.time() - start_time) * 1000
    
    if redis_manager.is_connected():
        print(f"✅ Redis connected successfully ({init_time:.2f}ms)")
        
        # Test basic operations
        print(f"\n🧪 Testing Basic Operations...")
        
        # Test set/get
        test_key = "test:setup:key"
        test_value = {"message": "Hello Redis!", "timestamp": time.time()}
        
        set_start = time.time()
        set_success = await redis_manager.set(test_key, test_value, ttl=60)
        set_time = (time.time() - set_start) * 1000
        
        if set_success:
            print(f"✅ Set operation: {set_time:.2f}ms")
        else:
            print(f"❌ Set operation failed")
            return False
        
        # Test get
        get_start = time.time()
        retrieved_value = await redis_manager.get(test_key)
        get_time = (time.time() - get_start) * 1000
        
        if retrieved_value == test_value:
            print(f"✅ Get operation: {get_time:.2f}ms")
        else:
            print(f"❌ Get operation failed - data mismatch")
            return False
        
        # Test exists
        exists_start = time.time()
        key_exists = await redis_manager.exists(test_key)
        exists_time = (time.time() - exists_start) * 1000
        
        if key_exists:
            print(f"✅ Exists operation: {exists_time:.2f}ms")
        else:
            print(f"❌ Exists operation failed")
            return False
        
        # Test delete
        delete_start = time.time()
        delete_success = await redis_manager.delete(test_key)
        delete_time = (time.time() - delete_start) * 1000
        
        if delete_success:
            print(f"✅ Delete operation: {delete_time:.2f}ms")
        else:
            print(f"❌ Delete operation failed")
            return False
        
        # Test pattern operations
        print(f"\n🔍 Testing Pattern Operations...")
        
        # Set multiple test keys
        test_keys = [
            ("cache:blogs:list", {"blogs": [{"id": 1, "title": "Test Blog"}]}),
            ("cache:users:profile:123", {"user_id": 123, "name": "Test User"}),
            ("cache:jobs:recent", {"jobs": [{"id": 1, "title": "Test Job"}]})
        ]
        
        for key, value in test_keys:
            await redis_manager.set(key, value, ttl=300)
        
        # Test pattern get
        pattern_start = time.time()
        pattern_data = await redis_manager.get_pattern("cache:*")
        pattern_time = (time.time() - pattern_start) * 1000
        
        print(f"✅ Pattern get: {pattern_time:.2f}ms ({len(pattern_data)} keys)")
        
        # Test pattern delete
        delete_pattern_start = time.time()
        deleted_count = await redis_manager.delete_pattern("cache:*")
        delete_pattern_time = (time.time() - delete_pattern_start) * 1000
        
        print(f"✅ Pattern delete: {delete_pattern_time:.2f}ms ({deleted_count} keys)")
        
        # Test session management
        print(f"\n👤 Testing Session Management...")
        
        session_data = {"user_id": 123, "login_time": time.time(), "permissions": ["read", "write"]}
        session_start = time.time()
        session_set = await redis_manager.set_session("test_session_123", session_data, ttl=3600)
        session_time = (time.time() - session_start) * 1000
        
        if session_set:
            print(f"✅ Session set: {session_time:.2f}ms")
        else:
            print(f"❌ Session set failed")
        
        # Test rate limiting
        print(f"\n🚦 Testing Rate Limiting...")
        
        rate_limit_start = time.time()
        current_count = await redis_manager.increment_rate_limit("rate_limit:test:ip_123", ttl=60)
        rate_limit_time = (time.time() - rate_limit_start) * 1000
        
        print(f"✅ Rate limit increment: {rate_limit_time:.2f}ms (count: {current_count})")
        
        # Get Redis info
        print(f"\n📊 Redis Server Information...")
        redis_info = await redis_manager.get_redis_info()
        
        if "error" not in redis_info:
            print(f"  Version: {redis_info.get('version', 'Unknown')}")
            print(f"  Connected Clients: {redis_info.get('connected_clients', 'Unknown')}")
            print(f"  Memory Usage: {redis_info.get('used_memory_human', 'Unknown')}")
            print(f"  Total Commands: {redis_info.get('total_commands_processed', 'Unknown')}")
        else:
            print(f"❌ Failed to get Redis info: {redis_info['error']}")
        
        # Get cache stats
        print(f"\n📈 Cache Performance Statistics...")
        stats = redis_manager.get_cache_stats()
        
        print(f"  Connected: {'✅' if stats['connected'] else '❌'}")
        print(f"  Hits: {stats['hits']}")
        print(f"  Misses: {stats['misses']}")
        print(f"  Sets: {stats['sets']}")
        print(f"  Deletes: {stats['deletes']}")
        print(f"  Hit Rate: {stats['hit_rate_percent']}%")
        print(f"  Efficiency: {stats['efficiency']}")
        
        return True
        
    else:
        print(f"❌ Redis connection failed")
        return False

async def setup_sample_cache_data():
    """Set up sample cache data for testing"""
    print(f"\n📝 Setting Up Sample Cache Data...")
    print("=" * 50)
    
    if not redis_manager.is_connected():
        print("❌ Redis not connected")
        return
    
    # Sample blog cache
    sample_blogs = [
        {"id": 1, "title": "Getting Started with DSA", "author": "John Doe", "views": 1250},
        {"id": 2, "title": "Interview Tips for Tech Companies", "author": "Jane Smith", "views": 890},
        {"id": 3, "title": "Resume Optimization Guide", "author": "Mike Johnson", "views": 2100}
    ]
    
    await redis_manager.set("cache:blogs:list", sample_blogs, ttl=1800)  # 30 minutes
    print(f"✅ Cached {len(sample_blogs)} sample blogs")
    
    # Sample user profiles
    sample_users = [
        {"id": 1, "name": "Alice Johnson", "email": "alice@example.com", "premium": True},
        {"id": 2, "name": "Bob Smith", "email": "bob@example.com", "premium": False},
        {"id": 3, "name": "Carol Davis", "email": "carol@example.com", "premium": True}
    ]
    
    for user in sample_users:
        await redis_manager.set(f"cache:users:profile:{user['id']}", user, ttl=3600)  # 1 hour
    
    print(f"✅ Cached {len(sample_users)} sample user profiles")
    
    # Sample job listings
    sample_jobs = [
        {"id": 1, "title": "Senior Software Engineer", "company": "Tech Corp", "location": "San Francisco"},
        {"id": 2, "title": "Data Scientist", "company": "AI Labs", "location": "New York"},
        {"id": 3, "title": "Frontend Developer", "company": "Startup Inc", "location": "Remote"}
    ]
    
    await redis_manager.set("cache:jobs:recent", sample_jobs, ttl=900)  # 15 minutes
    print(f"✅ Cached {len(sample_jobs)} sample job listings")
    
    print(f"\n🎉 Sample cache data setup complete!")

def print_setup_instructions():
    """Print Redis setup instructions"""
    print(f"\n📋 Redis Setup Instructions")
    print("=" * 50)
    print(f"1. Add REDIS_URL to your environment variables:")
    print(f"   REDIS_URL=redis://username:password@host:port")
    print(f"")
    print(f"2. For Render deployment:")
    print(f"   - Create a Redis service in Render")
    print(f"   - Copy the REDIS_URL from the service")
    print(f"   - Add it to your web service environment variables")
    print(f"")
    print(f"3. For local development:")
    print(f"   - Install Redis: brew install redis (macOS)")
    print(f"   - Start Redis: redis-server")
    print(f"   - Set REDIS_URL=redis://localhost:6379")
    print(f"")
    print(f"4. Test the setup:")
    print(f"   python setup_redis.py")
    print(f"")
    print(f"5. Monitor Redis performance:")
    print(f"   GET /api/redis/stats")
    print(f"   GET /api/redis/info")
    print(f"   GET /api/redis/optimization/recommendations")

async def main():
    """Main setup function"""
    print("🚀 Redis Setup and Configuration")
    print("=" * 60)
    
    # Test Redis connection
    success = await test_redis_connection()
    
    if success:
        # Set up sample data
        await setup_sample_cache_data()
        
        print(f"\n🎉 Redis setup completed successfully!")
        print(f"✅ Your application is ready to use Redis caching")
        print(f"📊 Monitor performance at /api/redis/stats")
        
    else:
        print(f"\n❌ Redis setup failed")
        print_setup_instructions()
    
    # Cleanup
    await redis_manager.close()

if __name__ == "__main__":
    asyncio.run(main()) 