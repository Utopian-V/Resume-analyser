#!/usr/bin/env python3
"""
Performance Test Script
Handled by: DevOps Team
Purpose: Test and demonstrate performance optimizations

This script tests the performance improvements:
- Database connection speed
- Caching effectiveness
- Query optimization
- Response time improvements
"""
import asyncio
import time
import aiohttp
import json
from core.database import db

async def test_database_performance():
    """Test database performance with and without caching"""
    print("🚀 Testing Database Performance...")
    
    # Test query without caching
    start_time = time.time()
    result1 = await db.fetch("SELECT * FROM blogs WHERE status = 'published' LIMIT 10", use_cache=False)
    time_without_cache = (time.time() - start_time) * 1000
    
    # Test query with caching
    start_time = time.time()
    result2 = await db.fetch("SELECT * FROM blogs WHERE status = 'published' LIMIT 10", use_cache=True)
    time_with_cache = (time.time() - start_time) * 1000
    
    # Test cached query (should be much faster)
    start_time = time.time()
    result3 = await db.fetch("SELECT * FROM blogs WHERE status = 'published' LIMIT 10", use_cache=True)
    time_cached = (time.time() - start_time) * 1000
    
    print(f"📊 Performance Results:")
    print(f"  Without cache: {time_without_cache:.2f}ms")
    print(f"  With cache (first): {time_with_cache:.2f}ms")
    print(f"  With cache (cached): {time_cached:.2f}ms")
    print(f"  Cache speedup: {time_without_cache/time_cached:.1f}x faster")
    
    return {
        "without_cache": time_without_cache,
        "with_cache": time_with_cache,
        "cached": time_cached,
        "speedup": time_without_cache/time_cached
    }

async def test_api_endpoints():
    """Test API endpoint performance"""
    print("\n🌐 Testing API Endpoints...")
    
    base_url = "http://localhost:8000"
    
    async with aiohttp.ClientSession() as session:
        # Test health endpoint
        start_time = time.time()
        async with session.get(f"{base_url}/health") as response:
            health_time = (time.time() - start_time) * 1000
            print(f"  Health endpoint: {health_time:.2f}ms")
        
        # Test blogs endpoint
        start_time = time.time()
        async with session.get(f"{base_url}/api/blogs?limit=10") as response:
            blogs_time = (time.time() - start_time) * 1000
            print(f"  Blogs endpoint: {blogs_time:.2f}ms")
        
        # Test performance metrics
        start_time = time.time()
        async with session.get(f"{base_url}/performance/metrics") as response:
            perf_time = (time.time() - start_time) * 1000
            print(f"  Performance metrics: {perf_time:.2f}ms")
    
    return {
        "health": health_time,
        "blogs": blogs_time,
        "performance": perf_time
    }

async def test_concurrent_requests():
    """Test concurrent request handling"""
    print("\n⚡ Testing Concurrent Requests...")
    
    base_url = "http://localhost:8000"
    num_requests = 10
    
    async def make_request(session, url):
        start_time = time.time()
        async with session.get(url) as response:
            response_time = (time.time() - start_time) * 1000
            return response_time
    
    async with aiohttp.ClientSession() as session:
        # Test concurrent health requests
        start_time = time.time()
        tasks = [make_request(session, f"{base_url}/health") for _ in range(num_requests)]
        health_times = await asyncio.gather(*tasks)
        total_health_time = (time.time() - start_time) * 1000
        
        # Test concurrent blog requests
        start_time = time.time()
        tasks = [make_request(session, f"{base_url}/api/blogs?limit=5") for _ in range(num_requests)]
        blog_times = await asyncio.gather(*tasks)
        total_blog_time = (time.time() - start_time) * 1000
        
        print(f"  Concurrent health requests ({num_requests}):")
        print(f"    Total time: {total_health_time:.2f}ms")
        print(f"    Average per request: {total_health_time/num_requests:.2f}ms")
        print(f"    Fastest: {min(health_times):.2f}ms")
        print(f"    Slowest: {max(health_times):.2f}ms")
        
        print(f"  Concurrent blog requests ({num_requests}):")
        print(f"    Total time: {total_blog_time:.2f}ms")
        print(f"    Average per request: {total_blog_time/num_requests:.2f}ms")
        print(f"    Fastest: {min(blog_times):.2f}ms")
        print(f"    Slowest: {max(blog_times):.2f}ms")
    
    return {
        "health_concurrent": health_times,
        "blogs_concurrent": blog_times,
        "total_health_time": total_health_time,
        "total_blog_time": total_blog_time
    }

async def test_cache_effectiveness():
    """Test cache effectiveness"""
    print("\n💾 Testing Cache Effectiveness...")
    
    # Test multiple identical queries
    query = "SELECT id, title FROM blogs WHERE status = 'published' LIMIT 5"
    
    times = []
    for i in range(5):
        start_time = time.time()
        result = await db.fetch(query, use_cache=True)
        query_time = (time.time() - start_time) * 1000
        times.append(query_time)
        print(f"  Query {i+1}: {query_time:.2f}ms")
    
    # Calculate cache effectiveness
    first_query = times[0]
    subsequent_queries = times[1:]
    avg_subsequent = sum(subsequent_queries) / len(subsequent_queries)
    
    print(f"  Cache effectiveness:")
    print(f"    First query: {first_query:.2f}ms")
    print(f"    Average subsequent: {avg_subsequent:.2f}ms")
    print(f"    Cache speedup: {first_query/avg_subsequent:.1f}x")
    
    return {
        "query_times": times,
        "first_query": first_query,
        "avg_subsequent": avg_subsequent,
        "speedup": first_query/avg_subsequent
    }

async def main():
    """Run all performance tests"""
    print("🎯 PrepNexus Performance Test Suite")
    print("=" * 50)
    
    try:
        # Initialize database
        await db.initialize()
        print("✅ Database initialized")
        
        # Run tests
        db_results = await test_database_performance()
        cache_results = await test_cache_effectiveness()
        
        # Try API tests (only if server is running)
        try:
            api_results = await test_api_endpoints()
            concurrent_results = await test_concurrent_requests()
        except Exception as e:
            print(f"⚠️ API tests skipped (server not running): {e}")
            api_results = {}
            concurrent_results = {}
        
        # Summary
        print("\n📈 Performance Summary:")
        print("=" * 50)
        print(f"Database caching speedup: {db_results['speedup']:.1f}x")
        print(f"Cache effectiveness: {cache_results['speedup']:.1f}x")
        
        if api_results:
            print(f"API response times:")
            for endpoint, time_ms in api_results.items():
                status = "✅ Fast" if time_ms < 100 else "⚠️ Slow" if time_ms < 500 else "❌ Very Slow"
                print(f"  {endpoint}: {time_ms:.2f}ms {status}")
        
        print("\n🎉 Performance test completed!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(main()) 